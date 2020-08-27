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
        public delegate void PermissionsChangendEventHandler(string newPerms);
        public static event PermissionsChangendEventHandler PermissionsChangedEvent;

        private static readonly string[] allPermissions = new string[] {
            "activate gun",
            "fly",
            "noclip",
            "gamemode1",
            "gamemode0",
            "tp",
            "godmode"
        };

        private static string[] permissions;
#if UNITY_EDITOR
        static Login()
        {
            Permissions = string.Join(";", allPermissions);
        }
#endif
        public static void OnPermissionsChanged(string newPerms)
        {
            PermissionsChangedEvent?.Invoke(newPerms);
        }

        public static string Permissions
        {
            set
            {
                if (value != null && value.Contains("*"))
                {
                    permissions = allPermissions;
                }
                else
                {
                    permissions = value.Split(';');                    
                }
                OnPermissionsChanged(value);
            }
        }

        public static bool hasItemNotEmpty(this string[] arr)
        {
            if (arr != null)
            {
                for (int i = 0; i < arr.Length; i++)
                {
                    if (arr[i] != null && arr[i] != "")
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        static int IndexOf(this string[] arr, string item)
        {
            if (arr != null)
            {
                for (int i = 0; i < arr.Length; i++)
                {
                    if (arr[i] == item)
                    {
                        return i;
                    }
                }
            }
            return -1;
        }
        
        public static bool ActionIsAllowed(string actName)
        {
            return permissions.IndexOf(actName) != -1;
        }
    }
}
