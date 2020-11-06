using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;
using UnityEngine.EventSystems;
using UnityEngine.UIElements;
using Assets.Scripts.Helper;

public class Listbox : MonoBehaviour
{
    public delegate void KeyDownEventHandler(string key);
    public event KeyDownEventHandler KeyDownEvent;

    public ClientScript client;
    public EventSystem eventSystem;

    private Dropdown dropDown;
    private string filter = "";

    private float filterTimeout = 0.0f;
    private float defaultFilterTimeout = 1.0f;

    void setDropDownValues()
    {
        List<string> tmp = MitarbeiterRaumListe.Items.Keys.FindAll(
            (item) =>
            {
                bool result = item.ToLower().StartsWith(filter);
                return result;
            }
        );
        if (tmp.Count == 0)
        {
            dropDown.transform.Find("Label").GetComponent<Text>().text = filter;
            //tmp.Add(filter);
        }
        else
        {
            dropDown.ClearOptions();
            dropDown.AddOptions(tmp);
        }
        //Debug.Log($"items: {tmp.Count} filter: '{filter}'");

        if (isSelected)
        {
            dropDown.Hide();
            StartCoroutine(ShowDropdown());
        }           
    }

    public bool isSelected
    {
        get
        {
            return eventSystem.currentSelectedGameObject != null &&
            (eventSystem.currentSelectedGameObject.name == gameObject.name || eventSystem.currentSelectedGameObject.transform.IsChildOf(gameObject.transform));
        }
    }

    private IEnumerator ShowDropdown()
    {
        //Print the time of when the function is first called.
        //Debug.Log("Started Coroutine at timestamp : " + Time.time);

        //yield on a new YieldInstruction that waits for 5 seconds.
        yield return new WaitForSeconds(0.1f);

        dropDown.Show();

        //After we have waited 5 seconds print the time again.
       // Debug.Log("Finished Coroutine at timestamp : " + Time.time);
    }

    void setFilter(string str)
    {
        if (str == "~")
        {
            filter = "";
        }
        
        else
        {
            // wenn abgelaufen wird erst direkt nach nächstem filter ändern zurückgesetzt
            if (filterTimeout <= 0)
            {
                filter = "";
            }
            filter += str;
            filterTimeout = defaultFilterTimeout;
        }
        setDropDownValues();
    }

    public void OnKeyDown(string key)
    {
        KeyDownEvent?.Invoke(key);
    }

    private int[] values;
    private string[] keyCodeLookup;

    void Awake()
    {
        values = new int[28];
        values[0] = 32; // space
        values[1] = 8; // backspace
        // a-z
        for (int i = 2; i < values.Length; i++)
        {
            values[i] = i + 95;  
        }
        keyCodeLookup = new string[values.Length];
        keyCodeLookup[0] = " ";
        keyCodeLookup[1] = "~";
        for (int i = 2; i < keyCodeLookup.Length; i++)
        {
            keyCodeLookup[i] = "" + (char)values[i];
        }

        KeyDownEvent += setFilter;
        dropDown = GetComponent<Dropdown>();
        MitarbeiterRaumListe.MitarbeiterListeReadyEvent += setDropDownValues;
    }

    void Update()
    {
        if (isSelected)
        {
            if (filterTimeout > 0)
            {
                filterTimeout -= Time.deltaTime;
            }
            if (Input.anyKeyDown)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    if (Input.GetKeyDown((KeyCode)values[i]))
                    {
                        OnKeyDown(keyCodeLookup[i]);
                        break;
                    }
                }
            }
        }
    }
}
