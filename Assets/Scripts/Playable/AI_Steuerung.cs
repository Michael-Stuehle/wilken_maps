using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using Assets.Scripts.Helper;
using System;

public class AI_Steuerung : MonoBehaviour
{
    public delegate void EndPointReachedEventHandler();
    public event EndPointReachedEventHandler EndPointReachedEvent;

    private List<Vector3> _points;
    private NavMeshAgent nav;

    private List<Vector3> path;
    private bool onEndPointRechedExecuted = false;
    public bool isSearching = false;

    private List<Vector3> Points
    {
        get
        {
            if (_points == null)
            {
                _points = new List<Vector3>();
            }
            return _points;
        }
        set
        {
            _points = value;
        }
    }

    public void OnEndPointReached()
    {
        if (EndPointReachedEvent != null)
        {
            EndPointReachedEvent.Invoke();
        }
    }

    public bool hasReachedEndPoint
    {
        get
        {
            return Points.Count == 0 && nav.remainingDistance <= nav.stoppingDistance && !nav.pathPending;
        }
    }

    public bool AddPoint(Vector3 point)
    {
        if (point == Constants.RAUM_NOT_FOUNT_COORDS)
        {
            return false;
        }
        isSearching = true;
        _points.Clear();
        Points.Add(point);
        onEndPointRechedExecuted = false;
        return true;
    }

    public bool setPosition(Vector3 position)
    {
        if (position == Constants.RAUM_NOT_FOUNT_COORDS)
        {
            return false;
        }
        //gameObject.transform.position = position;
        gameObject.transform.position = position;
        return true;
    }

    // Start is called before the first frame update
    void Start()
    {
        Time.timeScale = Constants.GAMESPEED;
        nav = GetComponent<NavMeshAgent>();
        nav.updatePosition = true;
        path = new List<Vector3>();
        EndPointReachedEvent += () =>
        {
            onEndPointRechedExecuted = true;
            DrawLine();
            path.Clear();
            Points.Clear();
            nav.ResetPath();
        };
    }


    // Update is called once per frame
    void Update()
    {
        if (!nav.pathPending && nav.remainingDistance <= nav.stoppingDistance)
        {
            GoToNextPoint();
        }
        else if (nav.remainingDistance > 0.5f)
        {
            path.Add( helperMethods.CopyVector(nav.transform.position) );
        }
    }

    void GoToNextPoint()
    {
        if (Points.Count == 0)
        {
            if (hasReachedEndPoint && !onEndPointRechedExecuted)
            {
                OnEndPointReached();
            } 
            return;
        }
        nav.SetDestination(Points[0]);
        Points.RemoveAt(0); // punkt wird ab jetzt angelaufen -> wird nicht mehr benötigt
    }

    void DrawLine()
    {
        LineRenderer lr = GetComponent<LineRenderer>();
        lr.positionCount = path.Count;
        for (int i = 0; i < lr.positionCount; i++)
        {
            lr.SetPosition(i, path[i]);
        }
    }
}
