using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;
using UnityEngine.EventSystems;

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


    // Start is called before the first frame update
    void Start()
    {
        dropDown = GetComponent<Dropdown>();
        MitarbeiterRaumListe.MitarbeiterListeReadyEvent += setDropDownValues;
        client.LoadMitarbeiterStart();
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
            tmp.Add(filter);
        }
        //Debug.Log($"items: {tmp.Count} filter: '{filter}'");
        dropDown.ClearOptions();
        dropDown.AddOptions(tmp);
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
        // wenn abgelaufen wird erst direkt nach nächstem filter ändern zurückgesetzt
        if (filterTimeout <= 0)
        {
            filter = "";
        }
        filter += str;
        filterTimeout = defaultFilterTimeout;
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
        values = new int[27];
        values[0] = 32; // space

        // a-z
        for (int i = 1; i < values.Length; i++)
        {
            values[i] = i + 96;  
        }
        keyCodeLookup = new string[values.Length];
        keyCodeLookup[0] = " ";
        for (int i = 1; i < keyCodeLookup.Length; i++)
        {
            keyCodeLookup[i] = "" + (char)values[i];
        }

        KeyDownEvent += setFilter;
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
