﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace Assets
{
    class Main : MonoBehaviour
    {
        public delegate void EtageChangedEventHandler(int etageIndex);
        public EtageChangedEventHandler EtageChangedEvent;

        public delegate void ZoomEventHandler(int zoomInOut);
        public ZoomEventHandler ZoomEvent;

        public GameObject[] Stockwerke;
        public Button btnUp;
        public Button btnDown;
        public Button btnZentrieren;
        public navigation nav;
        public Camera mainCamera;
        public float zoomSpeed;
        public float camMoveSpeed;
        public float camResetSpeed;

        private Vector3 cameraPosRelativZuEtage;
        private Vector3 lastPanPosition;
        private bool moveCamToStartPos = false;

        private int panFingerId; // Touch mode only

        private bool wasZoomingLastFrame; // Touch mode only
        private Vector2[] lastZoomPositions; // Touch mode only

        private int currStockIndex = 0;
        public GameObject AktuelleEtage
        {
            get
            {
                return Stockwerke[currStockIndex];
            }
            set
            {
                currStockIndex = Stockwerke.IndexOf(value);
            }
        }

        public int AktuelleEtageIndex
        {
            get
            {
                return currStockIndex;
            }
            set
            {
                if (value >= 0 && value < Stockwerke.Length && value != currStockIndex)
                {
                    currStockIndex = value;
                    OnEtageChanged(value);
                }                
            }
        }

        public void OnEtageChanged(int EtageIndex)
        {
            EtageChangedEvent?.Invoke(EtageIndex);
        }

        public void OnZoom(int zoomInOut)
        {
            ZoomEvent?.Invoke(zoomInOut);
        }

        void Start()
        {
            btnUp.onClick.AddListener(() => AktuelleEtageIndex += 1);
            btnDown.onClick.AddListener(() => AktuelleEtageIndex -= 1);
            btnZentrieren.onClick.AddListener(() => moveCamToStartPos = true);

            EtageChangedEvent += (aInt) =>
            {
                mainCamera.transform.position = Stockwerke[aInt].transform.position + cameraPosRelativZuEtage;
                nav.ReDraw();
            };

            ZoomEvent += (zoom) =>
            {
                // Allows zooming in and out via the mouse wheel
                if (zoom > 0)
                {
                    Ray ray = mainCamera.ScreenPointToRay(Input.mousePosition);
                    RaycastHit hit;
                    Physics.Raycast(ray, out hit);
                    mainCamera.transform.position = Vector3.MoveTowards(
                        mainCamera.transform.position,
                        hit.point, 
                        zoomSpeed * Time.deltaTime);
                }
                if (zoom < 0)
                { 
                    mainCamera.transform.position = Vector3.MoveTowards(
                        mainCamera.transform.position,
                         AktuelleEtage.transform.position + cameraPosRelativZuEtage + new Vector3(0,10,0), 
                        zoomSpeed * Time.deltaTime);
                }
            };

            cameraPosRelativZuEtage = mainCamera.transform.position;
        }

        void moveCam(float x, float y)
        {
            mainCamera.transform.position += new Vector3(x, 0, y) * camMoveSpeed * Time.deltaTime;
        }

        void PanCamera(Vector3 newPanPosition)
        {
            // Determine how much to move the camera
            Vector3 offset = mainCamera.ScreenToViewportPoint(lastPanPosition - newPanPosition);
            Vector3 move = new Vector3(offset.x * camMoveSpeed, 0, offset.y * camMoveSpeed);

            // Perform the movement
            mainCamera.transform.Translate(move, Space.World);

            // Ensure the camera remains within bounds.
            Vector3 pos = mainCamera.transform.position;
            //pos.x = Mathf.Clamp(transform.position.x, BoundsX[0], BoundsX[1]);
            //pos.z = Mathf.Clamp(transform.position.z, BoundsZ[0], BoundsZ[1]);
            mainCamera.transform.position = pos;

            // Cache the position
            lastPanPosition = newPanPosition;
        }

        void HandleCameraZoom()
        {
            float scrollMouseWheel = Input.GetAxis("Mouse ScrollWheel");
            float zoomWithKeyBoard = 0.0f;
            if (Input.GetKey(KeyCode.Plus) || Input.GetKey(KeyCode.KeypadPlus))
            {
                zoomWithKeyBoard += 1;
            }

            if (Input.GetKey(KeyCode.Minus) || Input.GetKey(KeyCode.KeypadMinus))
            {
                zoomWithKeyBoard -= 1;
            }
            bool controlKeyIsDown = Input.GetKey(KeyCode.LeftControl) || Input.GetKey(KeyCode.RightControl);
            if ((scrollMouseWheel > 0 || zoomWithKeyBoard > 0) && controlKeyIsDown)
            {
                OnZoom(+1);
            }
            else if ((scrollMouseWheel < 0 || zoomWithKeyBoard < 0) && controlKeyIsDown)
            {
                OnZoom(-1);
            }
        }

        void HandleCameraPan()
        {

            float moveX = 0.0f;
            float moveY = 0.0f;
            if (Input.GetKey(KeyCode.LeftArrow))
            {
                moveX -= 1;
            }

            if (Input.GetKey(KeyCode.UpArrow))
            {
                moveY += 1;
            }

            if (Input.GetKey(KeyCode.RightArrow))
            {
                moveX += 1;
            }

            if (Input.GetKey(KeyCode.DownArrow))
            {
                moveY -= 1;
            }

            moveCam(moveX, moveY);

            if (Input.GetMouseButtonDown(0))
            {
                lastPanPosition = Input.mousePosition;
                return;
            }

            if (Input.GetMouseButton(0))
            {
                PanCamera(Input.mousePosition);
            }
        }

        void HandleTouchControlls()
        {
            switch (Input.touchCount)
            {
                case 1: // Panning
                    wasZoomingLastFrame = false;

                    // If the touch began, capture its position and its finger ID.
                    // Otherwise, if the finger ID of the touch doesn't match, skip it.
                    Touch touch = Input.GetTouch(0);
                    if (touch.phase == TouchPhase.Began)
                    {
                        lastPanPosition = touch.position;
                        panFingerId = touch.fingerId;
                    }
                    else if (touch.fingerId == panFingerId && touch.phase == TouchPhase.Moved)
                    {
                        PanCamera(touch.position);
                    }
                    break;

                case 2: // Zooming
                    Vector2[] newPositions = new Vector2[] { Input.GetTouch(0).position, Input.GetTouch(1).position };
                    if (!wasZoomingLastFrame)
                    {
                        lastZoomPositions = newPositions;
                        wasZoomingLastFrame = true;
                    }
                    else
                    {
                        // Zoom based on the distance between the new positions compared to the 
                        // distance between the previous positions.
                        float newDistance = Vector2.Distance(newPositions[0], newPositions[1]);
                        float oldDistance = Vector2.Distance(lastZoomPositions[0], lastZoomPositions[1]);
                        if (newDistance > oldDistance)
                        {
                            OnZoom(+1);
                        }
                        else if (newDistance < oldDistance)
                        {
                            OnZoom(-1);
                        }                      

                        lastZoomPositions = newPositions;
                    }
                    break;

                default:
                    wasZoomingLastFrame = false;
                    break;
            }
        }

        void Update()
        {
            if (moveCamToStartPos)
            {
                mainCamera.transform.position = Vector3.MoveTowards(mainCamera.transform.position, AktuelleEtage.transform.position + cameraPosRelativZuEtage, camResetSpeed * Time.deltaTime);
                if (Vector3.Distance(mainCamera.transform.position, AktuelleEtage.transform.position + cameraPosRelativZuEtage) < 0.1f)
                {
                    moveCamToStartPos = false;
                }
            }

            HandleCameraZoom();

            HandleCameraPan();

            if (Input.touchSupported)
            {
                HandleTouchControlls();
            }

        }
    }
}
