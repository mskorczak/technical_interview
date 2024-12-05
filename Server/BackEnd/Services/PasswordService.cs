using System.Text.RegularExpressions;

namespace back_end.Services;

public class PasswordService : IPasswordService
{
    private readonly List<string> _commonPasswords = new List<string>();

    // load common passwords on start up to save us from having to re-load the file over and over 
    // if the list would change, then this is a bad idea
    public void LoadCommonPasswords(string filepath)
    {
        if (_commonPasswords.Count != 0) return;
        try
        {
            _commonPasswords.AddRange(File.ReadAllLines(filepath));
        }
        catch (Exception e)
        {
            throw new Exception("Error loading common passwords: ", e);
        }
    }
    
    public bool IsPasswordInvalid(string password)
    {
        // RegEx feels like cheating it's so good
        Regex regex = new Regex("^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!£$^*#])[a-zA-Z0-9!£$^*#]{7,14}$");
        return !regex.IsMatch(password);
    }
    
    public bool IsPasswordCommon(string? password)
    {
        if (password == null) return true; 
        // since .Contains tries to checks the index, password123! and 123!password will return true
        return _commonPasswords.Contains(password);
    }
}