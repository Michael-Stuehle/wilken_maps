using Assets.Scripts.Helper;
using System.Collections;
using System.Collections.Generic;
using System.IO;
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
    private static extern void LoadRaumliste(string jsonUrl);
#else
    private void LoadMitarbeiter()
    {
        using (WWW www = new WWW(Constants.MITARBEITERLISTE_URL))
        {
            while (!www.isDone)
            {
                new WaitForSeconds(0.1f);
            }
            Debug.Log(www.text);
            OnMitarbeiterListeLoad(www.text);
        }
    }

    private void LoadRaumliste(string jsonUrl)
    {
        using (WWW www = new WWW(jsonUrl))
        {
            while (!www.isDone)
            {
                new WaitForSeconds(0.1f);
            }

            OnRaumlisteLoad(www.text);
        }
    }
#endif

    public void LoadRaumlisteStart()
    {
        RaumlisteLoadEvent += (s) => raumlisteIsLoaded = true;
        LoadRaumliste(Constants.RAUMLISTE_URL);

        // blockieren bis fertig geladen ist
        while (!raumlisteIsLoaded)
        {
            new WaitForSeconds(0.1f);
        }
    }

    public void LoadMitarbeiterStart()
    {
        LoadMitarbeiter();
    }


}
