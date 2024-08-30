using System.Security.Claims;
using MatterTech.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using MatterTech.Infrastructure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace MatterTech.Web.Endpoints;

public class HomeIndex : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapGet(GetIndex);
    }

    public async Task<IResult> GetIndex(HttpContext httpContext 
        ,UserManager<ApplicationUser> userManager
        ,SignInManager<ApplicationUser> signInManager)
    {

        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Results.Ok();

        var user = await userManager.FindByIdAsync(userId);

        if (user != null)          
        {
            var userRoles = await userManager.GetRolesAsync(user);
            return Results.Ok(new { UserId = userId, UserName = user.UserName, Roles = userRoles });
        }
        else
        {
            return Results.Ok();
        }
       
        //return await sender.Send(new GetWeatherForecastsQuery());
    }
}
