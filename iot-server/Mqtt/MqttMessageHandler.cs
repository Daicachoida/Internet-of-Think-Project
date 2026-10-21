using System.Text.Json;
using IotServer.Data;
using IotServer.Entities;
using IotServer.Repositories.Interfaces;
using Microsoft.Extensions.Options;

namespace IotServer.Mqtt;

public class MqttMessageHandler(
    IServiceScopeFactory scopeFactory,
    IOptions<MqttOptions> options,
    LatestSensorCache cache,
    PendingCommandRegistry registry,
    ILogger<MqttMessageHandler> logger)
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };
    private readonly MqttOptions _opt = options.Value;
    private DateTime _lastSavedUtc = DateTime.MinValue;

    // Không bao giờ ném exception ra ngoài, để MQTT client không bị ảnh hưởng
    public async Task HandleAsync(string topic, string payload)
    {
        try
        {
            if (topic == _opt.SensorTopic) await HandleSensorAsync(payload);
            else if (topic == _opt.StatusTopic) await HandleStatusAsync(payload);
        }
        catch (JsonException ex)
        {
            logger.LogWarning("Payload sai định dạng trên topic {Topic}: {Message}", topic, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi xử lý message MQTT trên topic {Topic}", topic);
        }
    }

    private async Task HandleSensorAsync(string payload)
    {
        var data = JsonSerializer.Deserialize<SensorPayload>(payload, Json);
        if (data is null) return;

        var now = DateTime.UtcNow.AddHours(7);
        var values = new Dictionary<string, double>();

        if (data.Temp is { } t && InRange(t, -20, 80)) values["temp"] = t;
        if (data.Humidity is { } h && InRange(h, 0, 100)) values["humidity"] = h;
        if (data.Light is { } l && InRange(l, 0, 100)) values["light"] = l;

        if (values.Count == 0)
        {
            logger.LogWarning("sensor_data không có giá trị hợp lệ: {Payload}", payload);
            return;
        }

        foreach (var (code, value) in values)
            cache.Set(code, value, now);

        // Throttle: chỉ ghi DB mỗi SensorSaveIntervalSeconds
        if ((now - _lastSavedUtc).TotalSeconds < _opt.SensorSaveIntervalSeconds) return;

        using var scope = scopeFactory.CreateScope();
        var sensorRepo = scope.ServiceProvider.GetRequiredService<ISensorRepository>();
        var dataRepo = scope.ServiceProvider.GetRequiredService<ISensorDataRepository>();
        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var sensors = await sensorRepo.GetAllAsync();
        var rows = sensors
            .Where(s => values.ContainsKey(s.Code))
            .Select(s => new DataSensor { SensorId = s.Id, Value = values[s.Code], CreatedAt = now })
            .ToList();

        if (rows.Count == 0) return;

        await dataRepo.AddRangeAsync(rows);
        await uow.SaveChangesAsync();

        _lastSavedUtc = now;
        logger.LogInformation("Đã lưu {Count} dòng sensor", rows.Count);
    }

    private async Task HandleStatusAsync(string payload)
    {
        var msg = JsonSerializer.Deserialize<EspStatusPayload>(payload, Json);
        if (msg is null) return;

        if (msg.DeviceId == 0)
        {
            logger.LogWarning("ESP báo lệnh lạ: {Action}", msg.Action);
            return;
        }

        using var scope = scopeFactory.CreateScope();
        var historyRepo = scope.ServiceProvider.GetRequiredService<IActionHistoryRepository>();
        var deviceRepo = scope.ServiceProvider.GetRequiredService<IDeviceRepository>();
        var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var history = await historyRepo.GetLatestPendingAsync(msg.DeviceId);
        if (history is null)
        {
            logger.LogWarning("esp_status của device {DeviceId} nhưng không có lệnh Pending", msg.DeviceId);
            return;
        }

        var success = string.Equals(msg.Status, "success", StringComparison.OrdinalIgnoreCase);
        history.Status = success ? ActionStatus.Success : ActionStatus.Failed;
        history.RespondedAt = DateTime.UtcNow.AddHours(7);

        if (success)
        {
            var device = await deviceRepo.GetByIdAsync(msg.DeviceId);
            if (device is not null)
                device.IsOn = string.Equals(msg.State, "ON", StringComparison.OrdinalIgnoreCase);
        }

        await uow.SaveChangesAsync();
        registry.TryComplete(msg.DeviceId, msg);
    }

    private static bool InRange(double v, double min, double max)
        => !double.IsNaN(v) && v >= min && v <= max;
}
