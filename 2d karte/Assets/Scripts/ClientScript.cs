using Assets;
using Assets.Scripts.Helper;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using UnityEngine;

public class ClientScript : MonoBehaviour
{
    public delegate void MitarbeiterListeLoadEventHandler(string liste);
    public event MitarbeiterListeLoadEventHandler MitarbeiterListeLoadEvent;

    private bool raumlisteIsLoaded = false;


    public void OnMitarbeiterListeLoad(string liste)
    {
        MitarbeiterListeLoadEvent?.Invoke(liste);
    }

    private void Start()
    {
        LoadMitarbeiterStart();
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void LoadMitarbeiter();


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

    public static Raum findRaum(Raum[] Items, int id)
    {
        for (int i = 0; i < Items.Length; i++)
        {
            if (Items[i].id == id)
            {
                return Items[i];
            }
        }
        return new Raum();
    }

    private void getRaumById(string obj, int RaumId)
    {
        using (WWW www = new WWW(Constants.RAUMLISTE_URL))
        {
            while (!www.isDone)
            {
                new WaitForSeconds(0.1f);
            }

            string jsonText = www.text;
            Raum[] Items = JsonConvert.DeserializeObject<Raum[]>(jsonText);
            Raum raum = findRaum(Items, RaumId);
            raumlisteIsLoaded = true;
            GameObject.Find(obj).GetComponent<Zielpunkt>().OnRaumLoad(JsonConvert.SerializeObject(raum));
        }
    }
#endif


    public void loadRaumById(string objName, int raumId)
    {
        getRaumById(objName, raumId);
    }

    public void LoadMitarbeiterStart()
    {
        LoadMitarbeiter();
    }


}
