using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DesklampScript : Interactable
{
    float defaultIntensity;
    bool isOn = true;
    
    
    // Start is called before the first frame update
    void Start()
    {
        defaultIntensity = GetComponentInChildren<Light>().intensity;
        LookingAtObjectEvent += () =>
        {
            if (isOn)
            {
                ShowInfoLabel("drücke '" + AktivierungsTaste.ToString().ToUpper() + "' um die  Lampe auszuschalten");
            }
            else
            {
                ShowInfoLabel("drücke '" + AktivierungsTaste.ToString().ToUpper() + "' um die  Lampe anzuschlaten");
            }
        };
        InteractionEvent += SwitchOnOff;
    }

    void SwitchOnOff()
    {
        if (isOn)
        {
            isOn = false;
            GetComponentInChildren<Light>().intensity = 0.0f;
        }
        else
        {
            isOn = true;
            GetComponentInChildren<Light>().intensity = defaultIntensity;
        }
    }

}
