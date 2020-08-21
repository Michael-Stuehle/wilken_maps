using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ListBoxScript : MonoBehaviour
{
    public InputField inputField;
    public GameObject listBox;
    public RectTransform resultsParent;
    public RectTransform prefab;
    public RectTransform prefabHighlight;

    private string[] vorschläge;

    private bool focused = false;

    private int selectedIndex = 0;

    private float Height
    {
        get { return listBox.GetComponent<RectTransform>().rect.height; }
    }

    private int SelectedIndex
    {
        get
        {
            return Mathf.Max(0, Mathf.Min(Vorschläge.Length - 1, selectedIndex));
        }
        set
        {
            selectedIndex = Mathf.Max(0, Mathf.Min(Vorschläge.Length - 1, value));
        }
    }

    public string[] Vorschläge
    {
        get
        {
            return vorschläge;
        }

        set
        {
            vorschläge = value;
            ClearResults();
            FillResults(vorschläge);
            if (vorschläge.Length > 0 && focused)
            {
                listBox.SetActive(true);
            }
        }
    }

    private void Awake()
    {
        inputField.onValueChanged.AddListener(OnTextChanged);
        inputField.onEndEdit.AddListener((s) => { listBox.SetActive(false); focused = false; });
    }

    // Start is called before the first frame update
    void Start()
    {
        listBox.SetActive(false);
    }

    float getChildPositionY()
    {
        float y = 0.0f;
        for (int i = 0; i < SelectedIndex; i++)
        {
            y += resultsParent.GetChild(i).GetComponent<RectTransform>().rect.height;
        }
        return y;
    }

    bool selectedIsInView()
    {
        Transform child = resultsParent.GetChild(SelectedIndex);
        float minChildY = Mathf.Abs(resultsParent.anchoredPosition.y);

        if (getChildPositionY() + (child.GetComponent<RectTransform>().rect.height/2+5) > minChildY &&
            getChildPositionY() + (child.GetComponent<RectTransform>().rect.height/2+5) < minChildY + Height)
        {
            return true;
        }
        
        return false;
    }

    void ScrollUp(int prevSelected)
    {
        Canvas.ForceUpdateCanvases();
        if (!selectedIsInView())
        {
            float selectedChildPos = 0.0f;
            for (int i = SelectedIndex; i > 0; i--)
            {
                selectedChildPos += resultsParent.GetChild(i).GetComponent<RectTransform>().rect.height;
            }

            resultsParent.localPosition -= new Vector3(0, resultsParent.GetChild(prevSelected).GetComponent<RectTransform>().rect.height, 0);
        }
    }

    void ScrollDown(int prevSelected)
    {
        Canvas.ForceUpdateCanvases();
        if (!selectedIsInView())
        {
            float selectedChildPos = 0.0f;
            for (int i = 0; i < selectedIndex; i++)
            {
                selectedChildPos += resultsParent.GetChild(i).GetComponent<RectTransform>().rect.height;
            }
            resultsParent.localPosition += new Vector3(0, resultsParent.GetChild(prevSelected).GetComponent<RectTransform>().rect.height, 0);
        }
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Tab) || Input.GetKeyDown(KeyCode.Return))
        {
            inputField.text = vorschläge[SelectedIndex];
            inputField.caretPosition = inputField.text.Length;
        }

        if (Input.GetKeyDown(KeyCode.DownArrow))
        {
            int temp = SelectedIndex;
            SelectedIndex += 1;
            Vorschläge = vorschläge; // property auf feld setzen macht nichts (nur upate)
            ScrollDown(temp);
        }

        if (Input.GetKeyDown(KeyCode.UpArrow))
        {
            int temp = SelectedIndex;
            SelectedIndex -= 1;
            Vorschläge = vorschläge; // property auf feld setzen macht nichts (nur upate)
            ScrollUp(temp);
        }
        
    }

    public void OnTextChanged(string newText)
    {
        focused = true;
        List<string> vorschläge = new List<string>();
        foreach (var item in Tür.ZielPunktListe.Keys)
        {
            if (item.ToLower().StartsWith(newText.ToLower()) && !vorschläge.Contains(item))
            { 
                vorschläge.Add(item);
            }
        }
        Vorschläge = vorschläge.ToArray();
    }
  

    private void ClearResults()
    {
        // Reverse loop since you destroy children
        for (int childIndex = resultsParent.childCount - 1; childIndex >= 0; --childIndex)
        {
            Transform child = resultsParent.GetChild(childIndex);
            child.SetParent(null);
            Destroy(child.gameObject);
        }
    }

    private void FillResults(string[] results)
    {
        for (int resultIndex = 0; resultIndex < results.Length; resultIndex++)
        {
            if (resultIndex == SelectedIndex)
            {
                RectTransform child = Instantiate(prefabHighlight) as RectTransform;
                child.GetComponentInChildren<TextMeshProUGUI>().text = "<mark=#3F33FF60>" + results[resultIndex] + "</mark>";
                child.SetParent(resultsParent);
            }
            else
            {
                RectTransform child = Instantiate(prefab) as RectTransform;
                child.GetComponentInChildren<TextMeshProUGUI>().text = results[resultIndex];
                child.SetParent(resultsParent);
            }
            
        }
    }
}
