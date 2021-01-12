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
        private Mitarbeiter[] mitarbeiterVonRaum = new Mitarbeiter[0];

        float timerResetValue = 0.1f;
        public float moveuptimer = 0.0f;
        float movedowntimer = 0.0f;
        float scaleMultiplier = 8f;

        bool enter = false;
        bool isGoingUp = false;
        bool isGoingDown = false;



        private RaumInfo raumInfo;

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
            raumInfo = GameObject.Find("RaumInfo").GetComponent<RaumInfo>();
        }

        // Awake ist vor mitarbeiterlisteLoad
        void Awake()
        {
            GameObject.Find("ClientObject").GetComponent<ClientScript>().loadRaumById(gameObject.name, Raum_id);
        }


        void Update()
        {        



            if (moveuptimer > 0 && moveuptimer <= timerResetValue)  // animation vergrößern
            {
                moveuptimer -= Time.deltaTime;
                transform.localScale *= 1 + (scaleMultiplier * Time.deltaTime);
            }
            else if (movedowntimer > 0 && movedowntimer <= timerResetValue) // animation verkleinern
            {
                movedowntimer -= Time.deltaTime;
                transform.localScale /= 1 + (scaleMultiplier * Time.deltaTime);
            }

            if (!isGoingUp && !isGoingDown && enter) // macht nichts und maus over
            {
                isGoingUp = true;
                moveuptimer = timerResetValue;
            }

            if (isGoingUp && moveuptimer <= 0 && !enter) // ist oben und maus hat verlassen
            {
                isGoingUp = false;
                isGoingDown = true;
                movedowntimer = timerResetValue;
            }

            if (isGoingDown && movedowntimer <= 0) // ist unten
            {
                isGoingDown = false;
            }
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

        void OnMouseDown()
        {
            raumInfo.setRaumInfoText(Name, mitarbeiterVonRaum, true);        
        }

        private void OnMouseEnter()
        {
            //transform.localScale *= Constants.MOUSEOVER_SCALE_MULTIPLIER;
            raumInfo.setRaumInfoText(Name, mitarbeiterVonRaum);
            enter = true;         
        }

        private void OnMouseExit()
        {
            //transform.localScale /= Constants.MOUSEOVER_SCALE_MULTIPLIER;
            raumInfo.resetRaumInfo();
            enter = false;
        }
    }
}
