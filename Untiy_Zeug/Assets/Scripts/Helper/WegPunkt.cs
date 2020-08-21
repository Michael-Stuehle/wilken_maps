using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Helper
{
    class WegPunkt
    {
        private GameObject obj;

        public static WegPunkt neuenPunktErstellen(float x, float y, float z)
        {
            WegPunkt wegPunkt = new WegPunkt();
            wegPunkt.gameObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
            wegPunkt.gameObject.transform.position = new Vector3(x, y, z);
            wegPunkt.gameObject.transform.localScale = new Vector3(0, 0, 0);
            return wegPunkt;
        }

        public GameObject gameObject
        {
            get { return obj; }
            set { obj = value; }
        }
    }
}
