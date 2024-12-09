using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("[controller]")]
public class PasswordController : ControllerBase
{
    private readonly ILogger<PasswordController> _logger;
    private readonly IPasswordService _passwordService;
    
    public PasswordController(ILogger<PasswordController> logger, IPasswordService passwordService)
    {
        _logger = logger;
        _passwordService = new PasswordService("Data/common-passwords.txt");
    }

    [HttpPost("change")]
    public IActionResult SetPassword(PasswordChangeRequest request)
    {
        _logger.LogInformation("Received password change request");

        if (_passwordService.IsPasswordInvalid(request.Password) ||
            _passwordService.IsPasswordCommon(request.Password))
        {
            return BadRequest();
        }
        return Ok();
    }
}