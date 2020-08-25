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

    string username = "";
    public string UserName
    {
        get => username;
    }

    void Start()
    {
        getUserInfo();
        StartCoroutine(GetRequest("http://ul-ws-mistueh:8080/permissions"));
    }

    string get = "";

    IEnumerator GetRequest(string url)
    {
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        formData.Add(new MultipartFormDataSection("username", "michael.stuehle@wilken.de"));

        UnityWebRequest uwr = UnityWebRequest.Post(url, formData);
        yield return uwr.SendWebRequest();

        if (uwr.isNetworkError)
        {
            Debug.Log("Error While Sending: " + uwr.error);
        }
        else
        {
            Debug.Log("Received: " + uwr.downloadHandler.text);
        }
    
    }

    public void setUserName(string user)
    {
        username = user;
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

    void OnGUI()
    {
        if (get != "")
        {
            ShowInfoLabel(get);
        }
    }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void LoadMitarbeiter();

    [DllImport("__Internal")]
    private static extern void LoadUserInfo();

#elif UNITY_EDITOR
    private void LoadMitarbeiter()
    {
        string text = "";
        text = System.IO.File.ReadAllText(Application.streamingAssetsPath + "/mitarbeiter.txt");
        OnFileLoad(text);
    }

    private void LoadUserInfo()
    {
        string text = "";
        text = System.IO.File.ReadAllText(Application.streamingAssetsPath + "/userinfo.txt");
        OnUsersLoad(text);
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

    public void getUserInfo()
    {
        UserInfoFileLoadEvent += Login.SetUserInfo;
        LoadUserInfo();
    }
}
