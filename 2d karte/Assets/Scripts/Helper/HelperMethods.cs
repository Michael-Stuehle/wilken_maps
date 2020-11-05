using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets
{
    static class HelperMethods
    {
        public static int IndexOf<T>(this T[] arr, T obj)
        {
            if (arr != null && obj != null && arr.Length > 0)
            {
                for (int i = 0; i < arr.Length; i++)
                {
                    if (obj.Equals(arr[i]))
                    {
                        return i;
                    }
                }
            }
            return -1;
        }

        public static Vector3 getPositionForName(string name)
        {
            Vector3 result;
            MitarbeiterRaumListe.Items.TryGetValue(name, out result);
            return result;
        }
    }
}
