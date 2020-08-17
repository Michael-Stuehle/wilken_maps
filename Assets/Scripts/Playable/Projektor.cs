using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;

public class Projektor : MonoBehaviour
{
    public VideoPlayer videoPlayer;
    public string videoURL;

    public delegate void PlayEventHandler();
    public event PlayEventHandler PlayEvent;

    public event PlayEventHandler StopPlayEvent;

    bool enter = false;
    bool isPlaying = false;

    public void OnPlay()
    {
        PlayEvent?.Invoke();
    }

    public void OnStopPlaying()
    {
        StopPlayEvent?.Invoke();
    }

    // Start is called before the first frame update
    void Start()
    {
        if (videoPlayer != null && videoURL != null && videoURL != "")
        {
            videoPlayer.source = VideoSource.Url;
            videoPlayer.url = Application.streamingAssetsPath + "/" + videoURL;
            PlayEvent += () =>
            {
                isPlaying = true;
                videoPlayer.Play();
            };
            StopPlayEvent += () =>
            {
                isPlaying = false;
                videoPlayer.Pause();
            };
        }   
    }

    // Update is called once per frame
    void OnGUI()
    {
        if (enter)
        {
            if (isPlaying)
            {
                GUI.Label(new Rect(Screen.width / 2 - 110, Screen.height - 100, 220, 30), "Press 'F' to pause the Presentation");
            }
            else
            {
                GUI.Label(new Rect(Screen.width / 2 - 100, Screen.height - 100, 200, 30), "Press 'F' to start the Presentation");
            }
        }
    }

    void Update()
    {
        if (enter && Input.GetKeyDown(KeyCode.F))
        {
            if (isPlaying)
            {
                OnStopPlaying();
            }
            else
            {
                OnPlay();
            }
        }
    }

    // Activate the Main function when Player enter the trigger area
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            enter = true;
        }
    }

    // Deactivate the Main function when Player exit the trigger area
    void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            enter = false;
        }
    }
}
