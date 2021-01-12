using Assets.Scripts.Helper;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Assets
{
    class Zielpunkt : MonoBehaviour
    {
        public int Raum_id;
        private string _name;
        public string Name
        {
            get
            {
                return _name;
            }
        }

        private Main main;
        private Camera cam;
        private Mitarbeiter[] mitarbeiterVonRaum;

       public void OnRaumLoad(string text)
        {
            Raum r = JsonConvert.DeserializeObject<Raum>(text);
            
            //------NUR FÜR DEMO ZWECKE-------------------------
            if (r.id == -1) // nicht gefunden
            {
                r.name = GetComponentInChildren<TextMeshPro>().text; // default text
            }
            //--------------------------------------------------

            _name = r.name;
            mitarbeiterVonRaum = new Mitarbeiter[r.mitarbeiter.Count];
            r.mitarbeiter.CopyTo(mitarbeiterVonRaum, 0);


            GetComponentInChildren<TextMeshPro>().text = Name;
            MitarbeiterRaumListe.RaumListe.Add(Name, transform.position);
        }

        private void Start()
        {
            main = GameObject.Find("Main").GetComponent<Main>();
            cam = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<Camera>();
        }

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            GameObject.Find("ClientObject").GetComponent<ClientScript>().loadRaumById(gameObject.name, Raum_id);
        }

        string mitarbeiterVonRaumAsString()
        {
            string ret = "";
            for (int i = 0; i < mitarbeiterVonRaum.Length; i++)
            {
                ret += "\n - " + mitarbeiterVonRaum[i].name;
            }
            if (mitarbeiterVonRaum.Length == 0)
            {
                ret += " -";
            }
            return ret;
        }

        private void OnMouseEnter()
        {            
            transform.localScale *= Constants.MOUSEOVER_SCALE_MULTIPLIER;
            transform.position += new Vector3(0, 5, 0);
            GetComponentInChildren<TextMeshPro>().text = Name + mitarbeiterVonRaumAsString();
        }


        private void OnMouseExit()
        {
            transform.localScale /= Constants.MOUSEOVER_SCALE_MULTIPLIER;
            transform.position -= new Vector3(0, 5, 0);
            GetComponentInChildren<TextMeshPro>().text = Name;

        }
    }
}
