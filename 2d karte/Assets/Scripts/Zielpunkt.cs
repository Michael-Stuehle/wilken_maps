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

        private void Start()
        {
            main = GameObject.Find("Main").GetComponent<Main>();
            cam = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<Camera>();
        }

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            name = lookupName(Raum_id);
            GetComponentInChildren<TextMeshPro>().text = name;
            MitarbeiterRaumListe.RaumListe.Add(name, transform.position);
        }

        string lookupName(int raum_id)
        {
            return Raumliste.getRaumNameById(raum_id);
        }
    }
}
