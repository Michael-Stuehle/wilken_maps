using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class planeControls : Interactable
{
    public float turnSpeed;
    private float mouseY;
    private float mouseX = -90;

    public float beschleunigung = 0.03f;
    public float currSpeed = 0.0f;
    public float maxSpeed = 10.0f;

    private float gravity = 1;
    public float verticalSpeed = 0.0f;
    float maxVerticalSpeed = 5.0f;
    public Vector3 tilting;
    float tiltingSpeed = 5.0f;
    float maxTilting = 30.0f;

    public void SpawnPlaneAtPosition(Vector3 position)
    {
        transform.position = position + Vector3.up;
    }

    public GameObject player;
    public Camera cam;

    private bool isActive = false;

    public bool IsActive
    {
        get => isActive;
        set
        {
            setPlayerActive(!value);
            setPlaneActive(value);
            isActive = value;
        }
    }

    void setPlaneActive(bool value)
    {
        cam.enabled = value;
    }

    void setPlayerActive(bool value)
    {
        if (value)
        {
            player.transform.position = transform.position;
        }
        player.SetActive(value);
        player.GetComponent<Steuerung>().enabled = value;
    }

    void InfoLabel()
    {
        ShowInfoLabel("Drücke '" + AktivierungsTaste.ToString() + "' um einzusteigen");
    }

    // Start is called before the first frame update
    void Start()
    {
        LookingAtObjectEvent += InfoLabel;
        InteractionEvent += () => IsActive = !IsActive;
        IsActive = false;
    }

    

    // Update is called once per frame
    void Update()
    {
        if (IsActive && !GameObject.Find("Menu").GetComponent<Menu>().Paused)
        {
            if (Input.GetKeyDown(AktivierungsTaste))
            {
                IsActive = false;
            }

            CameraRotation();

            if (Input.GetAxis("Vertical") > 0) // Input.GetAxis("Vertical")
            {
                currSpeed = Mathf.Min(maxSpeed, currSpeed + beschleunigung * Time.deltaTime);
            }
            else if (Input.GetAxis("Vertical") < 0)
            {
                currSpeed -= (currSpeed/5) * Time.deltaTime;
            }
            else if (currSpeed > 0)
            {
                currSpeed -= (currSpeed / 10) * Time.deltaTime; 
            }

            if (Input.GetAxis("Horizontal") < -0.5)
            {
                tilting.x -= tiltingSpeed * Time.deltaTime;
            }
            else if (Input.GetAxis("Horizontal") > 0.5)
            {
                tilting.x += tiltingSpeed * Time.deltaTime;
            }
            else
            {
                tilting.x = SlowToZero(tilting.x, 3.0f);
            }
            tilting.x = Mathf.Clamp(tilting.x, -maxTilting, maxTilting);

            // fallen
            if (currSpeed < maxSpeed / 2)
            {
                verticalSpeed -= gravity * Time.deltaTime;
            }
            else // fliegen
            {
                // hoch
                if (Input.GetKey(KeyCode.Space))
                {
                    verticalSpeed += 2.0f * Time.deltaTime;
                }

                verticalSpeed = SlowToZero(verticalSpeed, 5.0f);
            }

            verticalSpeed = Mathf.Clamp(verticalSpeed, -5, 5);

            if (verticalSpeed < -0.5)
            {
                tilting.z += tiltingSpeed * Time.deltaTime;
            }
            else if (verticalSpeed > 0.5)
            {
                tilting.z -= tiltingSpeed * Time.deltaTime;
            }
            tilting.z = Mathf.Clamp(tilting.z, -maxTilting, maxTilting);
            tilting.z = SlowToZero(tilting.z, 3.0f);
            
            CharacterController cc = GetComponent<CharacterController>();
            if (cc.isGrounded)
            {
                tilting = Vector3.zero;
            }

            cc.Move(transform.TransformDirection(Vector3.left * currSpeed * Time.deltaTime));
            cc.Move(transform.TransformDirection(Vector3.up * verticalSpeed * Time.deltaTime));
            transform.eulerAngles += new Vector3(0, Input.GetAxis("Horizontal"), 0);
            transform.eulerAngles = new Vector3(tilting.x, transform.eulerAngles.y, tilting.z);

        }
    }

    float SlowToZero(float val, float time)
    {
        if (val < 0)
        {
            val += (Mathf.Abs(val) / time) * Time.deltaTime;
        }
        else
        {
            val -= (val / time) * Time.deltaTime;
        }
        return val;
    }

    void CameraRotation()
    {
        mouseX += Input.GetAxis("Mouse X");
        mouseY += Input.GetAxis("Mouse Y");

        Vector3 cameraRotationBody = new Vector3(-mouseY, mouseX, 0.0f) * turnSpeed;
        cam.transform.eulerAngles = cameraRotationBody;
    }

}
