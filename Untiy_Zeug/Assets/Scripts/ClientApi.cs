using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class ClientApi : MonoBehaviour
{

    // Adresse
    public string url;

    private string erg;
    // Start is called before the first frame update
    void Start()
    {
        // rugt den Server auf
        StartCoroutine(Get(url));
    }

    void OnGUI()
    {
        if (erg != "")
        {
           // GUI.Label(new Rect(Screen.width / 2, Screen.height / 2, 200, 30), erg);
        }
    }

    // aktiviert asynchron ähnliche Funktionsweise in Unity
    public IEnumerator Get(string url)
    {
        // Anfrage an den Node Server
        using(UnityWebRequest www = UnityWebRequest.Get(url))
        {
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log(www.error);
            }
            else
            {
                if (www.isDone)
                {
                    // Daten werden on eine globale Variable gespeichert
                    var ergebnis = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
                    erg = ergebnis;
                }
                else
                {
                    // Fehlerhandling
                    Debug.Log("Error");
                }

            }
        }
    }
}
