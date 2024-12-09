using back_end.Services;

namespace Backend.Tests;

public class PasswordTests
{
    private readonly PasswordService _passwordService;

    public PasswordTests()
    {
        _passwordService = new PasswordService(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"common-passwords.txt"));
    }
    
    [Theory]
    [InlineData("abcdefg",true)]
    [InlineData("abcdef",false)]
    [InlineData("abcdefghijklmn",true)]
    [InlineData("abcdefghijklmno",false)]
    public void PasswordLengthValid(string password, bool valid)
    {
        var check = _passwordService.IsPasswordLengthValid(password);
        Assert.Equal(valid, check);
    }

    [Theory]
    [InlineData("password", false)]
    [InlineData("password1", false)]
    [InlineData("password!", false)]
    [InlineData("password1!", true)]
    public void PasswordContainsMinimumCharacters(string password, bool valid)
    {
        var check = _passwordService.IsPasswordContainingMinimumCharacters(password);
        Assert.Equal(valid, check);
    }
    
    [Theory]
    [InlineData("password",true)]
    [InlineData("password(",false)]
    [InlineData("password\u00a9",false)]
    public void PasswordContainsOnlyLegalCharacters(string password, bool valid)
    {
        var check = _passwordService.IsPasswordContainingOnlyLegalCharacters(password);
        Assert.Equal(valid, check);
    }
    
    // not sure why, however, 'password' on it's own is not considered a 'common' password
    // As explained in the comments for the PasswordTree, for the '123!passwords' test, I feel like it should count
    //  as a common password but doesnt in this implementation!
    [Theory]
    [InlineData("123!passwords",false)] 
    [InlineData("password123!",true)]
    [InlineData("123!haslo",false)]
    [InlineData("haslo123!",false)]
    [InlineData("passwords",true)]
    [InlineData("haslo",false)]
    public void PasswordIsCommon(string password, bool valid)
    {
        var check = _passwordService.IsPasswordCommon(password);
        Assert.Equal(valid, check);
    }
    
    [Theory]
    [InlineData("123!passwords",true)]
    [InlineData("password123!",true)] // this is a valid password, regardless of it being common
    [InlineData("123!haslo",true)]
    [InlineData("haslo123!",true)]
    [InlineData("passwords",false)]
    [InlineData("haslo",false)]
    [InlineData("password\u00a9",false)]
    public void PasswordIsValid(string password, bool valid)
    {
        // The logic here is hard to read, the test checks whether I am passing in a VALID password
        var check = !(_passwordService.IsPasswordInvalid(password));
        Assert.Equal(valid, check);
    }
}