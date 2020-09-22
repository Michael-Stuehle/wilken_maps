using Assets;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;


namespace Assets
{
    class navigation : MonoBehaviour
    {
        public delegate void EndPointReachedEventHandler();
        public event EndPointReachedEventHandler EndPointReachedEvent;

        public Main main;

        private Vector3 start;
        private Vector3 ziel;

        private NavMeshPath path;

        public void OnEndPointReached()
        {
            if (EndPointReachedEvent != null)
            {
                EndPointReachedEvent.Invoke();
            }
        }

        public bool setStart(Vector3 point)
        {
            if (point == Vector3.zero)
            {
                return false;
            }
            start = point;
            return true;
        }

        public bool setZiel(Vector3 point)
        {
            if (point == Vector3.zero)
            {
                return false;
            }
            ziel = point;
            return true;
        }

        public bool setPosition(Vector3 position)
        {
            if (position == Vector3.zero)
            {
                return false;
            }
            return true;
        }

        // Start is called before the first frame update
        void Start()
        {
            ziel = start = Vector3.zero;
            EndPointReachedEvent += () =>
            {
                DrawLine();
                path.ClearCorners();
            };
            setStart(GameObject.Find("start").transform.position);
            setZiel(GameObject.Find("ziel").transform.position);
            StartCalcPath();
        }

        public void StartCalcPath()
        {
            if (ziel != start && ziel != Vector3.zero  && start != Vector3.zero)
            {
                path = new NavMeshPath();
                NavMesh.CalculatePath(start, ziel, 0 | 2 | 3, path);
                OnEndPointReached();
            }
        }

        List<Vector3> toList(Vector3[] arr)
        {
            List<Vector3> list = new List<Vector3>();
            foreach (var item in arr)
            {
                list.Add(item);
            }
            return list;
        }

        void DrawLine()
        {
            LineRenderer lr = GetComponent<LineRenderer>();
            lr.positionCount = 0;
            List<Vector3> positions = toList(path.corners);

            int i = 0;
            while (i < positions.Count)
            {
                if (positions[i].y - main.AktuelleEtageIndex * 20 < -0.5f) // unter aktueller etage
                {
                    positions.RemoveAt(i);
                    continue;
                }
                else if (positions[i].y - main.AktuelleEtageIndex * 20 > 0.5f)// über aktueller etage
                {
                    positions.RemoveAt(i);
                    continue;
                }
                i++;
            }
            lr.positionCount = positions.Count;
            for (i = 0; i < positions.Count; i++)
            {
                lr.SetPosition(i, new Vector3(positions[i].x, positions[i].y + 0.5f, positions[i].z));
            }

        }

        public void ReDraw()
        {
            StartCalcPath();
        }
    }
}
