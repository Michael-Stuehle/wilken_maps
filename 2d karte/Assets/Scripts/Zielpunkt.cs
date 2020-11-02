using Assets.Scripts.Helper;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            name = lookupName(Raum_id);
            MitarbeiterRaumListe.RaumListe.Add(name, transform.position);
        }

        string lookupName(int raum_id)
        {
            return Raumliste.getRaumNameById(raum_id);
        }
    }
}
