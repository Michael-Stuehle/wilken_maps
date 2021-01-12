using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using UnityEngine;


namespace Assets.Scripts.Helper
{
    [Serializable]
    public class Mitarbeiter
    {
        public int id { get; set; }
        public string name { get; set; }
        public int raum_id { get; set; }
        public string user { get; set; }

        public override string ToString()
        {
            return $"id={id}, name={name}, user={user}, raum={raum_id}";
        }
    }

    [Serializable]
    public class Raum
    {
        public string name { get; set; } = "Kein RaumName gefunden";
        public int id { get; set; } = -1;
        public IList<Mitarbeiter> mitarbeiter { get; set; } = new List<Mitarbeiter>();

        public override string ToString()
        {
            string mitStr = "\r\n";
            for (int i = 0; i < mitarbeiter.Count; i++)
            {
                mitStr += "  " + mitarbeiter[i].ToString() + "\r\n";
            }
            return $"id={id}, name={name}, mitarbeiter=[{mitStr}]";

        }
    }
}
