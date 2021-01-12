using Assets.Scripts.Helper;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class RaumInfo : MonoBehaviour
{
    private TextMeshProUGUI textFieldRaum;
    private TextMeshProUGUI textFieldMitarbeiter;
    private const string lineBreak = "\r\n";

    private string lastClickedRaum = "";
    private Mitarbeiter[] lastClickedRaumMitarbeiter = new Mitarbeiter[0];

    // Start is called before the first frame update
    void Start()
    {
   
        textFieldRaum = transform.Find("raum").GetComponent<TextMeshProUGUI>();
        textFieldMitarbeiter = transform.Find("mitarbeiter").GetComponent<TextMeshProUGUI>();
    }

    public void setRaumInfoText(string raum, Mitarbeiter[] mitarbeiter, bool clicked = false )
    {
        string temp = "";
        for (int i = 0; i < mitarbeiter.Length; i++)
        {
            temp += "-" + mitarbeiter[i].name + lineBreak;
        }

        textFieldRaum.text = raum;
        textFieldMitarbeiter.text = temp;

        if (clicked)
        {
            lastClickedRaum = raum;
            lastClickedRaumMitarbeiter = new Mitarbeiter[mitarbeiter.Length];
            mitarbeiter.CopyTo(lastClickedRaumMitarbeiter, 0);
        }
    }

    public void resetRaumInfo()
    {
        setRaumInfoText(lastClickedRaum, lastClickedRaumMitarbeiter, false);
    }

}
