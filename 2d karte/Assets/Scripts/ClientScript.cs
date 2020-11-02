using Assets.Scripts.Helper;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class ClientScript : MonoBehaviour
{
    public delegate void MitarbeiterListeLoadEventHandler(string liste);
    public event MitarbeiterListeLoadEventHandler MitarbeiterListeLoadEvent;

    public void OnMitarbeiterListeLoad(string liste)
    {
        MitarbeiterListeLoadEvent?.Invoke(liste);
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void LoadMitarbeiter();
#else
    private void LoadMitarbeiter()
    {
        string text = File.ReadAllText("Assets/mitarbeiter.txt");

        Debug.Log("Methode: 'Clientscript.LoadMitarbeiter()' ist im editor nicht verfügbar");
        OnMitarbeiterListeLoad(text);
    }
#endif

    public void LoadMitarbeiterStart()
    {
        LoadMitarbeiter();
    }


}
