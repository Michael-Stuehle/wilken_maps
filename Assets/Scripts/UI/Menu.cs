using Assets.Scripts.Helper;
using Helper;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class Menu : MonoBehaviour
{
    public delegate void PauseResumeEventHandler();
    public event PauseResumeEventHandler PauseEvent;
    public event PauseResumeEventHandler ResumeEvent;

    public PathFinder pathFinder;

    public Canvas canvas;

    bool _paused;

    public List<GameObject> menuObjects;
    GameObject[] waitForPathFindUiObjects;
    GameObject[] inpStartZielObjects;

    string error = "";
    float errorTimeOut;
    public float defaultErrorTimeOut;
    private Vector3 warpPos = Vector3.zero;

    void setMitarbeiterListe()
    {
        PauseEvent -= setMitarbeiterListe;
        GameObject.Find("ClientObject").GetComponent<Clientscript>().getMitarbeiterRaumZuteilung();
    }

    public void OnPause()
    {
        if (PauseEvent != null)
        {
            PauseEvent.Invoke();
        }
    }

    public void OnResume()
    {
        if (ResumeEvent != null)
        {
            ResumeEvent.Invoke();
        }
    }

    public bool Paused
    {
        get { return _paused; }
        set
        {
            if (_paused && !value) // aktuell pausiert und soll resumed werden 
            {
                OnResume();
            }
            else if (!_paused && value) // aktuell nicht pausiert, soll pausiert werden
            {
                OnPause();
            }
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        PauseEvent += () =>
        {
            Pause();
            setStartZielObjectsActive(true);
        };

        ResumeEvent += () =>
        {
            Resume();
            setStartZielObjectsActive(false);
        };

        menuObjects = GameObject.FindGameObjectsWithTag("menuObject").ToList();
        waitForPathFindUiObjects = GameObject.FindGameObjectsWithTag("waitForPathFindUi");
        inpStartZielObjects = GameObject.FindGameObjectsWithTag("inpStartZiel");
        GameObject.Find("btnAbbrechen").GetComponent<Button>().onClick.AddListener(Resume);
        GameObject.Find("btnSuchen").GetComponent<Button>().onClick.AddListener(Suchen);

        pathFinder.EndPointReachedEvent += () => setWaitObjectsActive(false);
        setWaitObjectsActive(false);

        PauseEvent += setMitarbeiterListe;

        Resume();
    }

    void Update()
    {
        if (Input.GetKeyDown("escape") || Input.GetKeyDown("m"))
        {
            Paused = true;
        }
    }

    void OnGUI()
    {
        if (error != "")
        {
            var textDimensions = GUI.skin.label.CalcSize(new GUIContent(error));
            GUI.Label(new Rect(Screen.width / 2 - (textDimensions.x/2) , Screen.height / 2 - (textDimensions.y/2)-20, textDimensions.x , textDimensions.y), error);
            errorTimeOut -= Time.deltaTime;
            if (errorTimeOut <= 0)
            {
                error = "";
            }
        }
    }

    void ShowErrorMessage(string errMessage)
    {
        errorTimeOut = defaultErrorTimeOut;
        error = errMessage;
    }


    void Resume()
    {
        Time.timeScale = Constants.GAMESPEED;
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
        _paused = false;
        foreach (GameObject obj in menuObjects)
        {
            obj.SetActive(false);
        }
        
    }

    void Pause()
    {
        Time.timeScale = 0.0f;
        Cursor.visible = true;
        Cursor.lockState = CursorLockMode.None;
        _paused = true;
        foreach (GameObject obj in menuObjects)
        {
            obj.SetActive(true);
        }
        PauseVideos();
    }

    void PauseVideos()
    {
        GameObject[] videos = GameObject.FindGameObjectsWithTag("Projektor");
        foreach (var item in videos)
        {
            item.GetComponent<Projektor>().OnStopPlaying();
        }
    }
    
    void Suchen()
    {
        warpPos = Vector3.zero;
        InputField start = GameObject.Find("inpStart").GetComponentInChildren<InputField>();
        Vector3 startpos = helperMethods.lookupCoordsFuerRaum(start.text);

        InputField ziel = GameObject.Find("inpZiel").GetComponentInChildren<InputField>();
        Vector3 zielpos = helperMethods.lookupCoordsFuerRaum(startpos, ziel.text);

        if (zielpos == Constants.RAUM_NOT_FOUNT_COORDS || startpos == Constants.RAUM_NOT_FOUNT_COORDS)
        {
            ShowErrorMessage("kein weg gefunden");
            return;
        }
        if (pathFinder.setPosition(startpos))
        {
            warpPos = startpos;
            pathFinder.EndPointReachedEvent += warpTo;

            if (zielpos != Constants.RAUM_NOT_FOUNT_COORDS)
            {
                waitUntilPathFound();
                pathFinder.AddPoint(zielpos); // punkt gefunden
            }
        }
    }

    void warpTo()
    {
        if (warpPos != Vector3.zero)
        {
            GameObject.Find("Player").GetComponent<Steuerung>().WarpToPosition(warpPos);
        }
        pathFinder.EndPointReachedEvent -= warpTo;
    }

    void setWaitObjectsActive(bool active)
    {
        foreach (GameObject obj in waitForPathFindUiObjects)
        {
            obj.SetActive(active);
        }
    }

    void setStartZielObjectsActive(bool active)
    {
        foreach (GameObject obj in inpStartZielObjects)
        {
            obj.GetComponent<InputField>().interactable = active;
        }
    }

    void waitUntilPathFound()
    {
        Paused = false;
        setWaitObjectsActive(true);
    }

}
