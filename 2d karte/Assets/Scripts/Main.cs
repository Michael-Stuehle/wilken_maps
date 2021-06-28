using Assets.Scripts.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace Assets
{
    class Main : MonoBehaviour
    {
        public delegate void EtageChangedEventHandler(int etageIndex);
        public EtageChangedEventHandler EtageChangedEvent;

        public CameraMovement cam;
        public EventSystem eventSystem;
        public GameObject[] Etage;
        public navigation nav;
        

        private int currStockIndex = 0;
        public GameObject AktuelleEtage
        {
            get
            {
                return Etage[currStockIndex];
            }
            set
            {
                AktuelleEtageIndex = Etage.IndexOf(value);
            }
        }

        public int AktuelleEtageIndex
        {
            get
            {
                return currStockIndex;
            }
            set
            {
                if (value >= 0 && value < Etage.Length && value != currStockIndex)
                {
                    currStockIndex = value;
                    for (int i = 0; i < Etage.Length; i++)
                    {
                        HelperMethods.recursiveSetRendererEnabled(Etage[i].transform, false);
                    }
                    HelperMethods.recursiveSetRendererEnabled(Etage[value].transform, true);
                    OnEtageChanged(value);
                }                
            }
        }

        public void OnEtageChanged(int EtageIndex)
        {
            EtageChangedEvent?.Invoke(EtageIndex);
        }
    }
}
