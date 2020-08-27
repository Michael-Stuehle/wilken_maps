using Assets.Scripts.Helper;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;

public class Tür : Interactable
{
    private static Map<string, Vector3> raumListe;
    public static Map<string, Vector3> RaumListe
    {
        get
        {
            if (raumListe == null)
            {
                raumListe = new Map<string, Vector3>();
                raumListe.Add(Constants.INP_START_DEFAULT, Constants.AKTUELLE_POSITION_COORDS);
            }
            return raumListe;
        }
        set { raumListe = value; }
    }

    private static Map<string, Vector3> mitarbeiterliste;
    public static Map<string, Vector3> Mitarbeiterliste
    {
        get
        {
            if (mitarbeiterliste == null)
            {
                mitarbeiterliste = new Map<string, Vector3>();
            }
            return mitarbeiterliste;
        }
        set
        {
            mitarbeiterliste = value;
        }
    }

    static Map<string, Vector3> zielPunktListe;
    public static Map<string, Vector3> ZielPunktListe
    {
        get
        {
            if (zielPunktListe == null)
            {
                zielPunktListe = RaumListe + Mitarbeiterliste;
            }
            return zielPunktListe;
        }
    }

    // Smoothly open a door
    public float doorOpenAngle = 90.0f; //Set either positive or negative number to open the door inwards or outwards
    public float openSpeed = 0.25f; //Increasing this value will make the door open faster

    public string raumName;

    protected bool open = false;

    protected float defaultRotationAngle;
    protected float currentRotationAngle;
    protected float openTime = 0;

    protected Transform body;

    protected virtual void DoorOpenClose()
    {
        open = !open;
        currentRotationAngle = transform.localEulerAngles.y;
        openTime = 0; 
    }

    void Awake()
    {
        if (raumName != "")
        {
            RaumListe.Add(raumName.ToLower(), transform.Find("WarpPosition").transform.position);
            
            gameObject.GetComponentsInChildren<TextMeshPro>()[0].text = raumName;
            gameObject.GetComponentsInChildren<TextMeshPro>()[1].text = raumName;
        }
    }

    void Start()
    {
        defaultRotationAngle = transform.localEulerAngles.y;
        currentRotationAngle = transform.localEulerAngles.y;
        LookingAtObjectEvent += () =>
        {
            if (open)
            {
                ShowInfoLabel("Press '"+AktivierungsTaste.ToString().ToUpper()+"' to close the door");
            }
            else
            {
                ShowInfoLabel("Press '" + AktivierungsTaste.ToString().ToUpper() + "' to open the door");
            }
        };

        InteractionEvent += DoorOpenClose;
    }

    void Update()
    {
        if (openTime < 1)
        {
            openTime += Time.deltaTime * openSpeed;
        }
        transform.localEulerAngles = new Vector3(transform.localEulerAngles.x, Mathf.LerpAngle(currentRotationAngle, defaultRotationAngle + (open ? doorOpenAngle : 0), openTime), transform.localEulerAngles.z);

    }
   
}
