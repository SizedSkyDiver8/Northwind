using Microsoft.AspNetCore.Http;
using Serilog;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace NorthwindServer.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Unhandled exception occurred");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var result = JsonSerializer.Serialize(new
                {
                    message = "An unexpected error occurred. Please try again later."
                });

                await context.Response.WriteAsync(result);
            }
        }
    }
}
