using IotServer.Dtos.Devices;
using IotServer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IotServer.Controllers;

[Route("api/v1/devices")]
public class DevicesController(IDeviceService service) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<DeviceDto>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpPost("control")]
    public async Task<ActionResult<ControlDeviceResponse>> Control(
        ControlDeviceRequest request, CancellationToken ct)
        => Ok(await service.ControlAsync(UserId, request, ct));
}
