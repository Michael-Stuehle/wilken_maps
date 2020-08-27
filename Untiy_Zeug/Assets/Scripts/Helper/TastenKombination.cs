using Assets.Scripts.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Helper
{
    class TastenKombination
    {
        public delegate void KeyCombinationFoundEventHandler();
        public event KeyCombinationFoundEventHandler KeyCombinationFoundEvent;

        KeyCode[] lastInputs;
        KeyCode[] expected;
        bool isActive;
        bool isAllowed = false;

        public bool IsAllowed
        {
            get => isAllowed;
        }

        public bool Active
        {
            get => isActive;
            set => isActive = value;
        }

        public TastenKombination(KeyCode[] kombination, bool isActive)
        {
            lastInputs = new KeyCode[kombination.Length];
            expected = kombination;
            this.isActive = isActive;
            KeyCombinationFoundEvent += () => Active = false;

            Login.PermissionsChangedEvent += (val) =>
            {
                isAllowed = val.Split(';').hasItemNotEmpty();
            };
        }

        bool isComplete()
        {
            for (int i = 0; i < expected.Length; i++)
            {
                if (lastInputs[i] != expected[i])
                {
                    return false;
                }
            }
            return true;
        }

        void addKeyDown(KeyCode key)
        {
            // shift left
            for (int i = 1; i < lastInputs.Length; i++)
            {
                lastInputs[i - 1] = lastInputs[i];
            }
            lastInputs[lastInputs.Length - 1] = key;
        }

        public void OnTastenKombination()
        {
            KeyCombinationFoundEvent?.Invoke();
        }

        public void Update()
        {
            if (!isActive || !IsAllowed)
            {
                return;
            }
            if (Input.GetKeyDown(KeyCode.UpArrow)) addKeyDown(KeyCode.UpArrow);
            if (Input.GetKeyDown(KeyCode.DownArrow)) addKeyDown(KeyCode.DownArrow);
            if (Input.GetKeyDown(KeyCode.LeftArrow)) addKeyDown(KeyCode.LeftArrow);
            if (Input.GetKeyDown(KeyCode.RightArrow)) addKeyDown(KeyCode.RightArrow);
            if (Input.GetKeyDown(KeyCode.B)) addKeyDown(KeyCode.B);
            if (Input.GetKeyDown(KeyCode.A)) addKeyDown(KeyCode.A);
            if (Input.GetKeyDown(KeyCode.Return)) addKeyDown(KeyCode.Return);
            // mehr keys die evtl. verwendet werden können

            
            if (isComplete())
            {
                OnTastenKombination();
            }
        }

        public override string ToString()
        {
            string s = "";
            for (int i = 0; i < lastInputs.Length-1; i++)
            {
                s += lastInputs[i].ToString() + ", ";
            }
            s += lastInputs[lastInputs.Length - 1].ToString();
            return s;
        }
    }
}
