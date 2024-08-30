using MatterTech.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddKeyVaultIfConfigured(builder.Configuration);

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.UseExceptionHandler(options => { });


app.MapEndpoints();


// Load endpoint
app.MapGet("/api/IndexHtml/load", async () =>
{
    var filePath = "wwwroot/assets/indexHtmlModel.json";
    if (!File.Exists(filePath))
    {
        return Results.NotFound();
    }

    var json = await File.ReadAllTextAsync(filePath);
    return Results.Content(json, "application/json");
});

// Save endpoint
app.MapPost("/api/IndexHtml/save", async (HttpRequest request) =>
{
    var filePath = "wwwroot/assets/indexHtmlModel.json";
    using var reader = new StreamReader(request.Body);
    var json = await reader.ReadToEndAsync();

    try
    {
        await File.WriteAllTextAsync(filePath, json);
        return Results.Ok();
    }
    catch
    {
        return Results.BadRequest("Error saving file.");
    }
});






app.Run();

public partial class Program { }
