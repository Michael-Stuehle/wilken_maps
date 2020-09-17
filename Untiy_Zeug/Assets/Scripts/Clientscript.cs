using Assets.Scripts.Helper;
using Assets.Scripts.UI;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class Clientscript : MonoBehaviour
{
    public delegate void MitarbeiterFileLoadEventHandler(string fileContent);
    private event MitarbeiterFileLoadEventHandler FileLoadEvent;
    public delegate void UserInfoFileLoadEventHandler(string fileContent);
    public event UserInfoFileLoadEventHandler UserInfoFileLoadEvent;

    void Start()
    {
        LoadUserInfo(); // calls setPerms from javascript
    }

    public void setPerms(string perms)
    {
        Login.Permissions = perms;
    }

    public void OnFileLoad(string fileContent)
    {
        FileLoadEvent?.Invoke(fileContent);
    }

    public void OnUsersLoad(string filecontent)
    {
        UserInfoFileLoadEvent?.Invoke(filecontent);
    }

    protected void ShowInfoLabel(string text)
    {
        var textDimensions = GUI.skin.label.CalcSize(new GUIContent(text));
        GUI.Label(new Rect(Screen.width / 2 - (textDimensions.x / 2), Screen.height - 100, textDimensions.x, textDimensions.y), text);
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void LoadMitarbeiter();

    [DllImport("__Internal")]
    private static extern void LoadUserInfo();

#else
    private void LoadMitarbeiter()
    {
        
        string text = "";
        Debug.Log("Methode: 'Clientscript.LoadMitarbeiter()' ist im editor nicht verfügbar");
        OnFileLoad(text);
    }

    private void LoadUserInfo()
    {
        StartCoroutine(LoginUser());
    }

    IEnumerator GetRequest(string uri)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            // Request and wait for the desired page.
            webRequest.SetRequestHeader("X-Requested-With", "XMLHttpRequest");
            webRequest.SetRequestHeader("Cookie", sessionCookie);
            yield return webRequest.SendWebRequest();

            string[] pages = uri.Split('/');
            int page = pages.Length - 1;

            if (webRequest.isNetworkError)
            {
                Debug.Log(pages[page] + ": Error: " + webRequest.error);
            }
            else
            {
                Debug.Log(pages[page] + ":\nReceived: " + webRequest.downloadHandler.text);
            }
        }
    }

    string sessionCookie;

    public IEnumerator LoginUser()
    {
        WWWForm loginForm = new WWWForm();

        loginForm.AddField("username", "sql");
        loginForm.AddField("passwort", "1234");

        UnityWebRequest www = UnityWebRequest.Post("http:/ul-ws-mistueh/", loginForm);

        www.SetRequestHeader("X-Requested-With", "XMLHttpRequest");

        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error);
        }
        else
        {
            string s = www.GetResponseHeader("set-cookie");
            Debug.Log(s);
            sessionCookie = s.Substring(s.LastIndexOf("sessionID")).Split(';')[0];
            StartCoroutine(GetRequest("http://ul-ws-mistueh/mitarbeiter.txt"));
        }
    }

#endif

    Vector3 getValue(string raumNummer)
    {
        foreach (var item in Tür.RaumListe.Keys)
        {          
            if (item.EndsWith(raumNummer))
            {
                return Tür.RaumListe[item];
            }
        }
        return Constants.RAUM_NOT_FOUNT_COORDS;
    }

    void AddToRaumliste(string filecontent)
    {
        var arr = filecontent.Split(';');
        for (int i = 0; i < arr.Length; i++)
        {
            if (arr[i] != "")
            {
                try
                {
                    string key = arr[i].Split('=')[0];
                    Vector3 val = getValue(arr[i].Split('=')[1]);
                    Tür.Mitarbeiterliste.Add(key, val);
                }catch(Exception e)
                {
                    Debug.Log(e.Message);
                }
            }
        }
    }

    public void getMitarbeiterRaumZuteilung()
    {
        FileLoadEvent += AddToRaumliste;
        LoadMitarbeiter();
    }
}
