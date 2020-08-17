using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Helper
{
    class helperMethods
    {
        public static Vector3 CopyVector(Vector3 v)
        {
            return new Vector3(v.x, v.y, v.z);
        }

        public static Vector3 lookupCoordsFuerRaum(Vector3 startPos, string raumName)
        {
            Vector3 position = Constants.RAUM_NOT_FOUNT_COORDS;
            float minDist = float.PositiveInfinity;
            List<Vector3> list = Tür.ZielPunktListe.FindAll(raumName);

            if (list.Count == 0)
            {
                Debug.Log($"raum not found: {raumName}");
            }
            else if(list[0] == Constants.AKTUELLE_POSITION_COORDS) // spezialfall aktuelle position (garantiert nur 1 item also list[0])
            {
                position = GameObject.Find("Player").transform.position;
            }
            else
            {
                foreach (var item in list)
                {
                    float dist = Vector3.Distance(startPos, item);
                    if (dist < minDist)
                    {
                        minDist = dist;
                        position = item;
                    }
                }
            }
            return CopyVector(position);
        }

        public static Vector3 lookupCoordsFuerRaum(string raumName)
        {
            Vector3 position;
            if (!Tür.ZielPunktListe.TryGetValue(raumName, out position))
            {
                Debug.Log($"raum not found: {raumName}");
                position = Constants.RAUM_NOT_FOUNT_COORDS;
            }
            else if (position == Constants.AKTUELLE_POSITION_COORDS) // spezialfall aktuelle position
            {
                position = GameObject.Find("Player").transform.position;
              
            }
            return CopyVector(position);
        }
    }
}
