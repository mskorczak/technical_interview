namespace back_end.Services;

public interface IPasswordService
{
    public void LoadCommonPasswords(string filepath);
    public bool IsPasswordInvalid(string password);
    public bool IsPasswordCommon(string password);
}