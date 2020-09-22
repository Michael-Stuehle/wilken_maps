using Assets.Scripts.Helper;
using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class F3Script : MonoBehaviour
{
    public TextMeshProUGUI textFeld;
    public Transform player;
    private bool isShowing = false;
    private float fpsUpdateTimeout = 2.0f * Constants.GAMESPEED;
    private float lastfpsUpdated = 0.0f;
    private float postionUpdateTimeout = 0.5f * Constants.GAMESPEED;
    private float lastPositionUpdated = 0.0f;


    string infoText
    {
        get
        {
            Vector3 pos = Position;
            return 
                $"FPS: {FPS}\n" +
                $"X: {Math.Round(pos.x, 2)}  Y: {Math.Round(pos.y, 2)}  Z: {Math.Round(pos.z, 2)}";
        }
    }

    int fps;
    int FPS
    {
        get
        {
            lastfpsUpdated -= Time.deltaTime;
            if (lastfpsUpdated <= 0)
            {
                fps = Mathf.FloorToInt(1.0f / Time.deltaTime);
                lastfpsUpdated = fpsUpdateTimeout;
            }
            return fps;
        }
    }

    Vector3 position;
    Vector3 Position
    {
        get
        {
            lastPositionUpdated -= Time.deltaTime;
            if (lastPositionUpdated <= 0)
            {
                position = player.position;
                lastPositionUpdated = postionUpdateTimeout;
            }
            return position;
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        textFeld.gameObject.SetActive(false);
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.F3))
        {
            isShowing = !isShowing;
            textFeld.gameObject.SetActive(isShowing);
        }
        if (isShowing)
        {
            textFeld.text = infoText;
        }
    }
}
