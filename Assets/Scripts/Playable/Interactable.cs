using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Interactable : MonoBehaviour
{
    public delegate void InteractionEventHandler();
    public event InteractionEventHandler InteractionEvent;

    public delegate void LookingAtObjectEventHandler();
    public event LookingAtObjectEventHandler LookingAtObjectEvent;

    public KeyCode AktivierungsTaste = KeyCode.F;

    private bool lookingAt;
    private float timeOut;
    private float defaultTimeOut = 0.5f;
    private 

    // Update is called once per frame
    void LateUpdate()
    {
        if (Input.GetKeyDown(AktivierungsTaste) && lookingAt)
        {
            InteractionEvent?.Invoke();
        }
        timeOut -= Time.deltaTime;
        if (timeOut <= 0)
        {
            lookingAt = false;
        }
    }

    void OnGUI()
    {
        if (lookingAt)
        {
            LookingAtObjectEvent?.Invoke();
        }
    }

    protected void ShowInfoLabel(string text)
    {
        var textDimensions = GUI.skin.label.CalcSize(new GUIContent(text));
        GUI.Label(new Rect(Screen.width / 2 - (textDimensions.x / 2), Screen.height-100, textDimensions.x, textDimensions.y), text);
    }

    public void RayCastHitFromPlayerr()
    {
        lookingAt = true;
        timeOut = defaultTimeOut;
    }

}
