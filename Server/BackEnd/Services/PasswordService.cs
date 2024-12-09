using System.Text.RegularExpressions;

namespace back_end.Services;

public class PasswordService : IPasswordService
{
    
    
     private class PasswordTreeNode {
        
        public Dictionary<char, PasswordTreeNode> children { get; set; }
        public bool endOfWord { get; set; }

        public PasswordTreeNode()
        {
            children = new Dictionary<char, PasswordTreeNode>();
            endOfWord = false;
        }
    }

    private class PasswordTree
    {
        private readonly PasswordTreeNode _root;

        public PasswordTree()
        {
            _root = new PasswordTreeNode();
        }

        public void Insert(string password)
        {
            var currentNode = _root;
            foreach (var c in password)
            {
                if (!currentNode.children.ContainsKey(c))
                {
                    currentNode.children.Add(c, new PasswordTreeNode());
                }
                currentNode = currentNode.children[c];
            }
            currentNode.endOfWord = true;
        }

        public bool Search(string password)
        {
            var currentNode = _root;
            foreach (var c in password)
            {
                // This is where the logic gets a bit confusing
                //  if we want to just check whether the password the user gives 'passwords' EXACTLY
                //  then this traversal is easy, we just do the following
                if (!currentNode.children.ContainsKey(c)) return false;
                currentNode = currentNode.children[c];
            }
            return currentNode.endOfWord;   
            /* However, I had the idea that instead of just checking the tree like this, I'd want it to loop through
             *  the password given:
             *
             * For example
             *  123!passwords should loop through the first four characters (123!)
             *      and just continue looping through the above once it gets to p and return true for the common check
             *  I think this would just be done by popping off the first character, so we get down to just 'passwords'
             *      for the example which would work just fine, but for something like '123!someotherpasswords' it would
             *      not
             *  For this to work, I'd have to really slice up the stirng in multiple (if not all) of the possible spaces
             *      and then run this check in parallel since now I'd be giving the program a LOT more work
             *  I believe that that would be overengineering this however, as someotherpasswords is (marginally) more
             *      secure than the common password 'passwords', but still fun to think about!
             */
        }
        
    }
    
    
    private readonly List<string> _commonPasswords = new List<string>();

    public PasswordService(string commonPasswordFilepath)
    {
        LoadCommonPasswords(commonPasswordFilepath);
    }
    
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
        return !(regex.IsMatch(password) 
               && this.IsPasswordLengthValid(password) 
               && this.IsPasswordContainingMinimumCharacters(password) 
               && this.IsPasswordContainingOnlyLegalCharacters(password));
    }
    
    public bool IsPasswordLengthValid(string password) {
        // check if all the characters between the start and end of the password add to 7-14 characters
        Regex regex = new Regex("^.{7,14}$");
        return regex.IsMatch(password);
    }

    public bool IsPasswordContainingMinimumCharacters(string password) {
        // look ahead for the special characters and digits and match them at least once
        Regex regex = new Regex("^(?=.*?[!£$^*#])(?=.*?[0-9]).*$");
        return regex.IsMatch(password);
    }
    
    public bool IsPasswordContainingOnlyLegalCharacters(string password) {
        // check for any characters not in the allowed list
        Regex regex = new Regex("^[a-zA-Z0-9!£$^*#]*$");
        return regex.IsMatch(password);
    }
    
    public bool IsPasswordCommon(string? password)
    {
        if (password == null) return true; 
        // since .Contains tries to checks the index, password123! and 123!password will return true
        return _commonPasswords.Contains(password);
    }
}