using Assets.Scripts.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.UI
{
    static class Login
    {
        public static bool isDev = true;


        static Map<string, string> _userInfo;
        static Map<string, string> UserInfo
        {
            get
            {
                if (_userInfo == null)
                {
                    _userInfo = new Map<string, string>();
                }
                return _userInfo;
            }
            set
            {
                _userInfo = value;
            }
        }

        public static void SetUserInfo(string text)
        {
            string[] stringSeparators = new string[] { "\r\n" };
            var arr = text.Split(stringSeparators, StringSplitOptions.None);
            UserInfo = new Map<string, string>();
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] != "")
                {
                    arr[i] = arr[i].Replace("\r", "").Replace("\n", "").Trim();
                    try
                    {
                        string name = arr[i].Split('=')[0];
                        string pass = arr[i].Split('=')[1];
                        UserInfo.Add(name, pass);
                    }
                    catch (Exception e)
                    {
                        Debug.Log(e.Message);
                    }
                }
            }

        }

        static bool ComparePasswords(string user, string enteredPassword)
        {
            string savedPasswordHash;
            /* Fetch the stored value */
            if (UserInfo.TryGetValue(user, out savedPasswordHash))
            { 
                try
                {
                    /* Extract the bytes */
                    byte[] hashBytes = Convert.FromBase64String(savedPasswordHash);
                    /* Get the salt */
                    byte[] salt = new byte[16];
                    Array.Copy(hashBytes, 0, salt, 0, 16);
                    /* Compute the hash on the password the user entered */
                    var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, 100000);
                    byte[] hash = pbkdf2.GetBytes(20);
                    /* Compare the results */
                    string input = Convert.ToBase64String(hash);
                    byte[] save = new byte[20];
                    Array.Copy(hashBytes, 16, save, 0, 20);
                    string saved = Convert.ToBase64String(save);
                    GameObject.FindGameObjectWithTag("commandLine").GetComponent<CommandLine>().sendChatMessage($"entered:{input} | saved:{saved}");
                    for (int i = 0; i < 20; i++)
                    {
                        if (hashBytes[i + 16] != hash[i])
                        {
                            return false;
                        }
                    }
                } catch (Exception e)
                {
                    Debug.Log(e);
                }
                return true;
            }
            return false;
        }

        static string hashPassword(string pass)
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);
            //STEP 2 Create the Rfc2898DeriveBytes and get the hash value:
            var pbkdf2 = new Rfc2898DeriveBytes(pass, salt, 100000);
            byte[] hash = pbkdf2.GetBytes(20);

            //STEP 3 Combine the salt and password bytes for later use:
            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            //STEP 4 Turn the combined salt+hash into a string for storage
            string savedPasswordHash = Convert.ToBase64String(hashBytes);
            return savedPasswordHash;
        }

        public static bool Register(string name, string passwort)
        {
#if UNITY_EDITOR
            passwort = hashPassword(passwort);
            if (!UserInfo.TryGetValue(name, out string notUsed))
            {
                UserInfo.Add(name.Trim(), passwort);
                File.WriteAllText(Application.streamingAssetsPath + "/userinfo.txt", UserInfo.ToString());
                return true;
            }
            return false;
#else
            return false;
#endif
        }

        public static bool checkLogin(string name, string passwort)
        {
            if (ComparePasswords(name, passwort))
            {
                isDev = true;
                return true;
            }
            return false;
        }

        
    }
}
