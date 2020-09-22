using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace Assets
{
    class Main : MonoBehaviour
    {
        public delegate void EtageChangedEventHandler(int etageIndex);
        public EtageChangedEventHandler EtageChangedEvent;

        public GameObject[] Stockwerke;
        public Button btnUp;
        public Button btnDown;
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

        void Start()
        {
            btnUp.onClick.AddListener(() => AktuelleEtageIndex += 1);
            btnDown.onClick.AddListener(() => AktuelleEtageIndex -= 1);
            EtageChangedEvent += (aInt) => nav.ReDraw();
        }

    }
}
