using Assets.Scripts.Helper;
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
        private string name;
        public string Name
        {
            get
            {
                return name;
            }
        }

        private Main main;
        private Camera cam;
        private Mitarbeiter[] mitarbeiterVonRaum;

        private void Start()
        {
            main = GameObject.Find("Main").GetComponent<Main>();
            cam = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<Camera>();
        }

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            Raum r = Raumliste.getRaumbyId(Raum_id);
            name = r.name;
            mitarbeiterVonRaum = new Mitarbeiter[r.mitarbeiter.Count];
            r.mitarbeiter.CopyTo(mitarbeiterVonRaum, 0);


            GetComponentInChildren<TextMeshPro>().text = name;
            MitarbeiterRaumListe.RaumListe.Add(name, transform.position);
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
            GetComponentInChildren<TextMeshPro>().text = name + mitarbeiterVonRaumAsString();
        }


        private void OnMouseExit()
        {
            transform.localScale /= Constants.MOUSEOVER_SCALE_MULTIPLIER;
            transform.position -= new Vector3(0, 5, 0);
            GetComponentInChildren<TextMeshPro>().text = name;

        }
    }
}
