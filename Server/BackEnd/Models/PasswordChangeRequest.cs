using System.ComponentModel.DataAnnotations;

namespace back_end.Models;

public class PasswordChangeRequest
{
    public string Password { get; set; } = string.Empty;
}