using Assets;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.UI;

namespace Assets
{
    class navigation : MonoBehaviour
    {
        public Button btnSuchen;
        public GameObject EtagePfeilPrefab;
        public GameObject Pfeil_prefab;
        public delegate void EndPointReachedEventHandler();
        public event EndPointReachedEventHandler EndPointReachedEvent;

        public Main main;

        private List<Vector3> wegPunkte = new List<Vector3>();

        private NavMeshPath[] paths;

        public void OnEndPointReached()
        {
            if (EndPointReachedEvent != null)
            {
                EndPointReachedEvent.Invoke();
            }
        }

        public bool addWegPunkt(Vector3 point)
        {
            if (point == Vector3.zero)
            {
                return false;
            }
            wegPunkte.Add(point);
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
            wegPunkte.Clear();

            main.EtageChangedEvent += (etage) =>
            {

            };
            EndPointReachedEvent += () =>
            {
                DrawLine();
            };
            btnSuchen.onClick.AddListener(() =>
            {
                wegPunkte.Clear();
                addWegPunkt(HelperMethods.getPositionForName(GameObject.Find("cmbStart").GetComponentInChildren<Text>().text));
                addWegPunkt(HelperMethods.getPositionForName(GameObject.Find("cmbZiel").GetComponentInChildren<Text>().text));
                StartCalcPath();
            });
            
            //addWegPunkt(GameObject.Find("start").transform.position);
            //addWegPunkt(GameObject.Find("ziel").transform.position);
            
        }

        public void StartCalcPath()
        {
            if (wegPunkte.Count > 1)
            {
                PfeileEntfernen();
                paths = null;
                paths = new NavMeshPath[wegPunkte.Count - 1];
                for (int i = 0; i < paths.Length; i++)
                {
                    paths[i] = new NavMeshPath();
                }

                int pathsIndex = 0;
                for (int i = 0; i < wegPunkte.Count -1; i++)
                {
                    NavMesh.CalculatePath(wegPunkte[i], wegPunkte[i+1], 0 | 2 | 3, paths[pathsIndex++]);
                }
                OnEndPointReached();
            }
        }

        void PfeileEntfernen()
        {
            GameObject[] pfeile = GameObject.FindGameObjectsWithTag("pfeil");
            foreach (GameObject item in pfeile)
            {
                Destroy(item);
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

        void checkNextPointForArrows(Vector3 curr, Vector3 next)
        {

        }

        void DrawLine()
        {
            LineRenderer lr = GetComponent<LineRenderer>();
            lr.positionCount = 0;
            for (int pathIndex = 0; pathIndex < paths.Length; pathIndex++)
            {
                int lastYChange = 0;
                var path = paths[pathIndex];

                List<Vector3> positions = toList(path.corners);

                int i = 0;
                while (i < positions.Count)
                {
                    if (i < positions.Count-1 && positions[i+1].y - positions[i].y < -0.5f) // nächste unter aktuelle
                    {
                        if (lastYChange != -1)
                        {
                            lastYChange = -1;
                            setEtagePfeil(positions[i], lastYChange); // etage unten pfeil nach oben
                            setEtagePfeil(positions[i+1], -lastYChange); // etage oben pfeil nach unten
                        }
                    }
                    else if (i < positions.Count - 1 && positions[i+1].y - positions[i].y > 0.5f)// nächste über aktuelle
                    {
                        if (lastYChange != +1)
                        {
                            lastYChange = +1;
                            setEtagePfeil(positions[i], lastYChange); // etage unten pfeil nach oben
                            setEtagePfeil(positions[i + 1], -lastYChange); // etage oben pfeil nach unten
                        }
                    }

                    if (positions[i].y - main.AktuelleEtageIndex * Constants.ETAGE_Y_DIFF < -0.5f) // unter aktueller etage
                    {
                        positions.RemoveAt(i);
                        continue;
                    }
                    else if (positions[i].y - main.AktuelleEtageIndex * Constants.ETAGE_Y_DIFF > 0.5f)// über aktueller etage
                    {
                        positions.RemoveAt(i);
                        continue;
                    }
                    i++;
                }
                lr.positionCount += positions.Count;
                for (i = lr.positionCount-positions.Count; i < lr.positionCount; i++)
                {
                    lr.SetPosition(i, new Vector3(positions[i].x, positions[i].y + 0.5f, positions[i].z));
                }
            }
            Vector3[] p = new Vector3[lr.positionCount];
            lr.GetPositions(p);
            wegPfeileZeichnen(p);
        }

        private void setEtagePfeil(Vector3 pos, int direction)
        {
            GameObject pfeil = Instantiate(EtagePfeilPrefab);
            if (direction < 0)
            {
                pfeil.transform.rotation = new Quaternion(0, 180, 0, 0);
            }
            
            pfeil.transform.position = pos + (new Vector3(1,0,-1)*direction);
        }

        private void wegPfeileZeichnen(Vector3[] positions)
        {
            for (int i = 0; i < positions.Length-1; i++)
            {
                
                Vector3 pointA = positions[i];
                Vector3 pointB = positions[i + 1];

                // falls linie zu klein ist, um pfeil ordentlich zu plazieren, einfach überspringen
                Vector3 objectSize = Vector3.Scale(Pfeil_prefab.transform.Find("Main").localScale, Pfeil_prefab.transform.Find("Main").GetComponent<MeshRenderer>().bounds.size);
                if (Vector3.Distance(pointA, pointB) < objectSize.z + 2)
                {
                    continue; 
                }
                Vector3 mittlepunkt = new Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);

                Vector3 _direction = (pointB - pointA).normalized;

                //create the rotation we need to be in to look at the target
                Quaternion _lookRotation = Quaternion.LookRotation(_direction);

                setPfeileAt(mittlepunkt, _lookRotation);
            }
        }

        private void setPfeileAt(Vector3 pos, Quaternion angle)
        {
            GameObject pfeil = Instantiate(Pfeil_prefab);
            pfeil.transform.rotation = angle;
            pfeil.transform.position = pos + (new Vector3(1.5f, 0, 0));            
        }

        public void ReDraw()
        {
            StartCalcPath();
        }
    }
}
