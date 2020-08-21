using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Popup : MonoBehaviour
{

    public Camera cam;
    public string text;

    // Start is called before the first frame update
    void Start()
    {
        Destroy(gameObject, 5);
    }

    void OnGui()
    {
        Vector3 screenPos = cam.WorldToScreenPoint(transform.position);
        GUI.Label(new Rect(screenPos.x, screenPos.y, 100, 30), text);
    }
}
