using IotServer.Dtos.Common;
using IotServer.Dtos.Sensors;
using IotServer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IotServer.Controllers;

[Route("api/v1/sensors")]
public class SensorsController(ISensorService service) : ApiControllerBase
{
    [HttpGet("latest")]
    public async Task<ActionResult<List<SensorLatestDto>>> Latest(CancellationToken ct)
        => Ok(await service.GetLatestAsync(ct));

    [HttpGet("chart-data")]
    public async Task<ActionResult<ChartDataDto>> ChartData([FromQuery] ChartDataQuery query, CancellationToken ct)
        => Ok(await service.GetChartDataAsync(query, ct));

    [HttpGet("history")]
    public async Task<ActionResult<PagedResult<SensorDataDto>>> History(
        [FromQuery] SensorHistoryQuery query, CancellationToken ct)
        => Ok(await service.GetHistoryAsync(query, ct));
}
