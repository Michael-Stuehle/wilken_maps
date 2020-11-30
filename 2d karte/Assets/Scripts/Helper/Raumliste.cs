﻿using System;
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

    public static class Raumliste
    {
        private static List<Raum> items;
        public static List<Raum> Items
        {
            get
            {
                if (items == null)
                {
                    items = new List<Raum>();
                    //Init(Constants.RAUMLISTE_URL);
                }
                return items;
            }

            set
            {
                items = value;
            }
        }

        public static Raum getRaumByName(string name)
        {
            for (int i = 0; i < Items.Count; i++)
            {
                if (Items[i].name == name)
                {
                    return Items[i];
                }
            }
            return new Raum();
        }

        public static Raum getRaumbyId(int id)
        {
            for (int i = 0; i < Items.Count; i++)
            {
                if (Items[i].id == id)
                {
                    return Items[i];
                }
            }
            return new Raum();
        }

        public static string[] getAlleItemNamen()
        {
            List<string> result = new List<string>();
            for (int i = 0; i < Items.Count; i++)
            {
                result.Add(Items[i].name);
                for (int j = 0; j < Items[i].mitarbeiter.Count; j++)
                {
                    result.Add(Items[i].mitarbeiter[j].name);
                }
            }
            return result.ToArray();
        }

        public static void setObjectsFromJSON(string json)
        {
            if (json != null && json.Length > 0)
            {
              //  Items = JsonConvert.DeserializeObject<Raum[]>(json);
            }
            else
            {
                //Items = new Raum[0];
            }
        }
/*
        private static void Init(string jsonUrl)
        {
            ClientScript client = GameObject.Find("ClientObject").GetComponent<ClientScript>();
            client.LoadRaumlisteAndWait();
        }
        */

    }
}
