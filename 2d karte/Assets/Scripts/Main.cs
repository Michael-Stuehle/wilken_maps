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
        public GameObject[] Stockwerke;
        public navigation nav;
        

        private int currStockIndex = 0;
        public GameObject AktuelleEtage
        {
            get
            {
                return Stockwerke[currStockIndex];
            }
            set
            {
                currStockIndex = Stockwerke.IndexOf(value);
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
                if (value >= 0 && value < Stockwerke.Length && value != currStockIndex)
                {
                    currStockIndex = value;
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
