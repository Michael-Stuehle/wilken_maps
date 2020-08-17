using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class gunScript : MonoBehaviour
{
    public GameObject barrel;
    public float timeOut = 1.0f;
    public GameObject ScorchmarkPrefab;
    public int damage = 10;

    public bool IsEnabled
    {
        get { return isEnabled; }
        set { isEnabled = value; }
    }

    private bool isEnabled = true;

    private float timeOfLastLineCreated;
    
    void Start()
    {
        gameObject.SetActive(false);
    }

    void Shoot()
    {
        Ray ray = Camera.main.ScreenPointToRay(new Vector3(Screen.width / 2, Screen.height / 2));
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit, 500.0f))
        {
            timeOfLastLineCreated = Time.time;
            DrawLine(barrel.transform.position, hit.point);
            Shootable character;
            if ((character = hit.collider.GetComponent<Shootable>()) != null)
            {
                character.OnHit(gameObject);
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (!GameObject.Find("Menu").GetComponent<Menu>().Paused && IsEnabled)
        {
            if (Input.GetButtonDown("Fire1"))
            {
                Shoot();
            }
        }
    }

    void DrawLine(Vector3 start, Vector3 ziel)
    {
        LineRenderer lr = GetComponent<LineRenderer>();
        lr.positionCount = 2;
       
        lr.SetPosition(0, start);
        lr.SetPosition(1, ziel);
        Invoke("resetLine", timeOut);
    }

    void resetLine()
    {
        float timePassed = Time.time - timeOfLastLineCreated;
        if ( timePassed >= timeOut)
        {
            GetComponent<LineRenderer>().positionCount = 0;
        }
        else
        {
            Invoke("resetLine", timePassed);
        }        
    }
}
