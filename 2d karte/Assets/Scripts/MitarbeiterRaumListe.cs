using Assets.Scripts.Helper;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class MitarbeiterRaumListe
{
    public delegate void MitarbeiterListeReadyEventHandler();
    public static event MitarbeiterListeReadyEventHandler MitarbeiterListeReadyEvent;

    public static void OnMitarbeiterListeReady()
    {
        MitarbeiterListeReadyEvent?.Invoke();
    }

    private static ClientScript client;

    // key (mitarbeiter-name), value (raum-name, wie in raumliste)
    private static Map<string, Vector3> _mitarbeiterListe;
    private static Map<string, Vector3> MitarbeiterListe
    {
        get
        {
            if (_mitarbeiterListe == null)
            {
                _mitarbeiterListe = new Map<string, Vector3>();
            }
            return _mitarbeiterListe;
        }
    }

    // key (raum-name), value (pos für pathfinding)
    private static Map<string, Vector3> _raumListe;
    private static Map<string, Vector3> RaumListe
    {
        get
        {
            if (_raumListe == null)
            {
                _raumListe = new Map<string, Vector3>();
            }
            return _raumListe;
        }
    }


    private static Map<string, Vector3> _items;
    public static Map<string, Vector3> Items
    {
        get
        {
            if (_items == null)
            {
                _items = new Map<string, Vector3>(RaumListe, MitarbeiterListe);
            }
            return _items;
        }
    }

    static Vector3 getValue(string raumNummer)
    {
        foreach (var item in RaumListe.Keys)
        {
            if (item.EndsWith(raumNummer))
            {
                return RaumListe[item];
            }
        }
        return Constants.RAUM_NOT_FOUND_COORDS;
    }

    static void MitarbeiterListeLoad(string str)
    {
        var arr = str.Split(';');
        for (int i = 0; i < arr.Length; i++)
        {
            if (arr[i] != "")
            {
                try
                {
                    string key = arr[i].Split('=')[0];
                    Vector3 val = getValue(arr[i].Split('=')[1]);
                    MitarbeiterListe.Add(key, val);
                }
                catch (Exception e)
                {
                    Debug.Log(e.Message);
                }
            }
        }
        OnMitarbeiterListeReady();
    }

    static MitarbeiterRaumListe()
    {
        client = GameObject.Find("ClientObject").GetComponent<ClientScript>();
        client.MitarbeiterListeLoadEvent += MitarbeiterListeLoad;
    }
}
