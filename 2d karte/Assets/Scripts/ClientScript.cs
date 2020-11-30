using Assets.Scripts.Helper;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using UnityEngine;

public class ClientScript : MonoBehaviour
{
    public delegate void MitarbeiterListeLoadEventHandler(string liste);
    public event MitarbeiterListeLoadEventHandler MitarbeiterListeLoadEvent;

    public delegate void RaumlisteLoadEventHandler(string json);
    public event RaumlisteLoadEventHandler RaumlisteLoadEvent;
    private bool raumlisteIsLoaded = false;


    public void OnMitarbeiterListeLoad(string liste)
    {
        MitarbeiterListeLoadEvent?.Invoke(liste);
    }

    public void OnRaumlisteLoad(string json)
    {
        RaumlisteLoadEvent?.Invoke(json);
    }

    private void Start()
    {
        LoadMitarbeiterStart();
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void LoadMitarbeiter();

    [DllImport("__Internal")]
    private static extern void LoadRaumliste();

    [DllImport("__Internal")]
    private static extern void getRaumById(string obj, int RaumId);
#else
    private void LoadMitarbeiter()
    {
        using (WWW www = new WWW(Constants.MITARBEITERLISTE_URL))
        {
            while (!www.isDone)
            {
                new WaitForSeconds(0.1f);
            }
            OnMitarbeiterListeLoad(www.text);
        }
    }

    private void LoadRaumliste()
    {
        using (WWW www = new WWW(Constants.RAUMLISTE_URL))
        {
            while (!www.isDone)
            {
                new WaitForSeconds(0.1f);
            }

            OnRaumlisteLoad(www.text);
        }
    }

    private void getRaumById(string obj, int RaumId)
    {
        //
    }
#endif

    public void LoadRaumlisteAndWait()
    {
        RaumlisteLoadEvent += (s) =>
        {
            Raumliste.setObjectsFromJSON(s);
            raumlisteIsLoaded = true;
        };

        LoadRaumliste();

        // blockieren bis fertig geladen ist
        while (!raumlisteIsLoaded)
        {
            new WaitForSeconds(1f);
        }
    }

    public void loadRaumById(string objName, int raumId)
    {
        getRaumById(objName, raumId);
    }

    public void LoadMitarbeiterStart()
    {
        LoadMitarbeiter();
    }


}
