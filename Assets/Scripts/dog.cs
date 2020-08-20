using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class dog : Interactable
{

    public GameObject arm;
    bool animIsPlaying = false;

    // Start is called before the first frame update
    void Start()
    {
        //arm.SetActive(false);
        //LookingAtObjectEvent += () => ShowInfoLabel("press 'F' to pet the dog");
        /*InteractionEvent += () =>
        {
            arm.SetActive(true);
        };*/
    }

    void StartAnimation()
    {
        animIsPlaying = true;
    }

    void StopAnimation()
    {
        animIsPlaying = false;
        arm.SetActive(false);
    }

    void Update()
    {
        if (animIsPlaying)
        {
            if (!LookingAt)
            {
                StopAnimation();
                return;
            }
            else
            {
                // rotate & move
            }
        }
    }
}
