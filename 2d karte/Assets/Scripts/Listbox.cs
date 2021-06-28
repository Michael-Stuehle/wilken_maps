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
    public string DefaultText;

    private Dropdown dropDown;
    private string filter = "";

    private float filterTimeout = 0.0f;
    private float defaultFilterTimeout = 1.0f;

    private bool hasSelectedItem = false;

    public bool HasSelectedItem
    {
        get => hasSelectedItem;
    }

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
            tmp.Sort((x, y) => string.Compare(x, y));
            if (!hasSelectedItem)
            {
                tmp.Insert(0, DefaultText);
            }
            dropDown.AddOptions(tmp);

            // nach filtern nur noch 1 item verfügbar
            // -> Item wird als filter gewählt
            if (tmp.Count == 1)
            {
                dropDown.onValueChanged.Invoke(0);
            }

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
        values = new int[52];
        values[0] = 32; // space
        values[1] = 8; // backspace
                     
        values[2] = 39;  // ä = quote
        values[3] = 96;  // ö = backquote
        values[4] = 59;  // ü = semicolon
        values[5] = 91;  // ß = leftbracket

        // a-z
        for (int i = 6; i < values.Length-20; i++)
        {
            values[i] = i + 91;  
        }

        for (int i = values.Length-20; i < values.Length-10; i++) // 0 - 9
        {
            values[i] = (i - (values.Length-20)) + 48; // integers
        }

        for (int i = values.Length - 10; i < values.Length; i++) // 0 - 9 keypad
        {
            values[i] = (i - (values.Length - 10)) + 256; // integers
        }

        keyCodeLookup = new string[values.Length];
        keyCodeLookup[0] = " ";
        keyCodeLookup[1] = "~";
        keyCodeLookup[2] = "ä";
        keyCodeLookup[3] = "ö";
        keyCodeLookup[4] = "ü";
        keyCodeLookup[5] = "ß";
        for (int i = 6; i < keyCodeLookup.Length-10; i++)
        {
            keyCodeLookup[i] = "" + (char)values[i];
        }

        for (int i = keyCodeLookup.Length -10; i < keyCodeLookup.Length; i++)
        {
            keyCodeLookup[i] = "" + (char)((values[i]-256)+48);
        }

        KeyDownEvent += setFilter;
        dropDown = GetComponent<Dropdown>();

        dropDown.onValueChanged.AddListener((index) =>
        {
            if (!hasSelectedItem && index > 0)
            {
                hasSelectedItem = true;
                dropDown.options.RemoveAt(0);
            }
        });
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
