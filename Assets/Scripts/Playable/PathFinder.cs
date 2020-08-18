using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using Assets.Scripts.Helper;
using System;

public class PathFinder : MonoBehaviour
{
    public delegate void EndPointReachedEventHandler();
    public event EndPointReachedEventHandler EndPointReachedEvent;

    private List<Vector3> _points;

    private NavMeshPath path;
    private bool onEndPointRechedExecuted = false;

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
        set => _points = value;
    }

    public void OnEndPointReached()
    {
        if (EndPointReachedEvent != null)
        {
            EndPointReachedEvent.Invoke();
        }
    }

    public bool AddPoint(Vector3 point)
    {
        if (point == Constants.RAUM_NOT_FOUNT_COORDS)
        {
            return false;
        }
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
        gameObject.transform.position = position;
        return true;
    }

    // Start is called before the first frame update
    void Start()
    {
        Time.timeScale = Constants.GAMESPEED;
        Points.Clear();
        EndPointReachedEvent += () =>
         {
             _points.Clear();
             onEndPointRechedExecuted = true;
             DrawLine();
             path.ClearCorners();
             Points.Clear();
         };
    }


    // Update is called once per frame
    void Update()
    {
        if (Points.Count > 0 && !onEndPointRechedExecuted) {
            path = new NavMeshPath();
            NavMesh.CalculatePath(transform.position, Points[0], 0 | 2 | 3, path);
            OnEndPointReached();            
        }
    }

    void DrawLine()
    {
        LineRenderer lr = GetComponent<LineRenderer>();
        lr.positionCount = path.corners.Length;
        for (int i = 0; i < lr.positionCount; i++)
        {
            Vector3 pos = path.corners[i];
            lr.SetPosition(i,  new Vector3(pos.x, pos.y + 0.5f, pos.z));
        }
    }
}
