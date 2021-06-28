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

        public static void Label(Vector3 pos, string text, GUIStyle style = null)
        {
            if (style == null)
            {
                style = new GUIStyle(); 
            }
            Vector3 screenPos = Camera.main.WorldToScreenPoint(pos);
            Vector2 size = style.CalcSize(new GUIContent(text));

            Rect r = new Rect(screenPos.x, Screen.height - screenPos.y, size.x, size.y);
            GUI.Label(r, text, style);
        }

        public static void recursiveSetRendererEnabled(Transform t, bool enabled)
        {
            if (t.childCount > 0)
            {
                foreach (Transform child in t)
                {
                    recursiveSetRendererEnabled(child, enabled);
                }
            }
            Renderer r = t.gameObject.GetComponent<Renderer>();
            if (r != null)
            {
                r.enabled = enabled;
            }
        }
    }
}
