using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Assets
{
    class Zielpunkt : MonoBehaviour
    {
        public string Name;

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            MitarbeiterRaumListe.RaumListe.Add(Name, transform.position);
        }
    }
}
