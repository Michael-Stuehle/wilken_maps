using Assets.Scripts.Helper;
using System;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Steuerung : Shootable
{
    //Variables
    public RectTransform head;
    public float speed;
    public float jumpSpeed;
    public float gravity;
    public float gravityMultiplier;
    public float turnSpeed;
    public float sprintMultiplier;
    public Vector3 moveDirection = Vector3.zero;
    public GameObject gun;
    private CharacterController characterController;

    private float mouseX = 0.0f;
    private float mouseY = 0.0f;

    public bool allowFly = false;
    private bool flying;
    private bool noClip = false;
    public bool NoClip
    {
        get
        {
            return noClip;
        }
        set
        {
            noClip = value;
            characterController.detectCollisions = !noClip;
            characterController.enabled = !noClip;
        }
    }

    public bool petDogWithLeftArm = false;

    float doubleClickButtonCooler = 1.0f; // Half a second before reset
    int doubleClickButtonCount = 0;

    void OnGUI()
    {
        GUI.Box(new Rect(Screen.width / 2, Screen.height / 2, 10, 10), "");
    }

    public override void Start()
    {
        characterController = GetComponent<CharacterController>();
        GameObject.FindGameObjectWithTag("MainCamera").GetComponent<Camera>().enabled = true;
        DeathEvent += () =>
        {
            SceneManager.UnloadSceneAsync(Constants.GAME_SCENE);
            SceneManager.LoadScene(Constants.DEATH_SCENE);
        };

        gun.GetComponent<gunScript>().GunEnabledChangedEvent += (gunIsEnabled) =>
        {
            petDogWithLeftArm = gunIsEnabled;
        };
    }

    Vector3 warpPosition = Vector3.zero;
    public void WarpToPosition(Vector3 newPosition)
    {
        warpPosition = newPosition;
    }

    void LateUpdate()
    {
        if (warpPosition != Vector3.zero)
        {
            characterController.enabled = false;
            transform.position = warpPosition;
            warpPosition = Vector3.zero;
            characterController.enabled = true;
        }
    }

    void setMoveDirection()
    {
        if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
        {
            moveDirection = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical") * sprintMultiplier);
        }
        else
        {
            //Feed moveDirection with input.
            moveDirection = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        }

        moveDirection = transform.TransformDirection(moveDirection);
        //Multiply it by speed.
        moveDirection *= speed;
    }

    void normalMovement()
    {
        // is the controller on the ground? 
        if (characterController.isGrounded)
        {
            setMoveDirection();

            //Jumping
            if (Input.GetButton("Jump"))
            {
                moveDirection.y = jumpSpeed;
            }

        }
        //Applying gravity to the controller
        if (!characterController.isGrounded)
        {
            // idee von https://www.youtube.com/watch?v=7KiK0Aqtmzc&feature=youtu.be&ab_channel=BoardToBitsGames
            if (moveDirection.y < 0)
            {
                moveDirection -= Vector3.up * gravity * (gravityMultiplier - 1) * Time.deltaTime;
            }

            //control jump height by length of time jump button held
            else if (moveDirection.y > 0 && !Input.GetButton("Jump"))
            {
                moveDirection -= Vector3.up * gravity * (gravityMultiplier - 1) * Time.deltaTime;
            }

            // normal gravity
            moveDirection -= Vector3.up * gravity * Time.deltaTime;

        }


        //Making the character move
        characterController.Move(moveDirection * Time.deltaTime);
    }

    void noClipMovement()
    {
        setMoveDirection();
        setMoveDirection();
        if (Input.GetButton("Jump"))
        {
            transform.position += new Vector3(moveDirection.x * 2, speed, moveDirection.z * 2) * Time.deltaTime;
        }
        else if (Input.GetKey(KeyCode.LeftControl))
        {
            transform.position += new Vector3(moveDirection.x * 2, -speed, moveDirection.z * 2) * Time.deltaTime;
        }
        else
        {
            transform.position += new Vector3(moveDirection.x * 2, 0, moveDirection.z * 2) * Time.deltaTime;
        }
    }

    void flyMovement()
    {
        setMoveDirection();
        if (Input.GetButton("Jump"))
        {
            characterController.Move(new Vector3(moveDirection.x*2, speed , moveDirection.z*2) * Time.deltaTime);
        }
        else if (Input.GetKey(KeyCode.LeftControl))
        {
            characterController.Move(new Vector3(moveDirection.x*2, -speed, moveDirection.z*2) * Time.deltaTime);
        }
        else
        {
            characterController.Move(new Vector3(moveDirection.x*2, 0, moveDirection.z*2) * Time.deltaTime);
        }
    }

    void checkFlyActivated()
    {
        if (allowFly)
        {
            if (Input.GetButtonDown("Jump"))
            {
                if (doubleClickButtonCooler > 0 && doubleClickButtonCount >= 1/*Number of Taps you want Minus One*/)
                {
                    flying = !flying;
                }
                doubleClickButtonCooler = 1.0f;
                doubleClickButtonCount += 1;
            }

            if (doubleClickButtonCooler > 0)
            {
                doubleClickButtonCooler -= 1 * Time.deltaTime;
            }
            else
            {
                doubleClickButtonCount = 0;
            }
        }
    }

    void CameraRotation()
    {
        mouseX += Input.GetAxis("Mouse X");
        mouseY += Input.GetAxis("Mouse Y");

        mouseY = Mathf.Min(90, mouseY); // muss zwischen -90 und +90
        mouseY = Mathf.Max(-45, mouseY);

        Vector3 cameraRotationTransform = new Vector3(0.0f, mouseX, 0.0f) * turnSpeed;
        transform.eulerAngles = cameraRotationTransform;
        Vector3 cameraRotationBody = new Vector3(mouseY * -1, mouseX, 0.0f) * turnSpeed;
        head.eulerAngles = cameraRotationBody;
    }

    void Update()
    {
        if (!GameObject.Find("Menu").GetComponent<Menu>().Paused) // kein pause menu
        {
            checkFlyActivated();
            if (flying && allowFly)
            {
                flyMovement();
            }
            else if (noClip)
            {
                noClipMovement();
            }
            else 
            {
                normalMovement();
            }

            CameraRotation();
            if (characterController.transform.position.y < -50)
            {
                HP -= 99999;
            }
        }
        checkForActions();
    }

    void checkForActions()
    {
        RaycastHit hit;
        Ray ray = GetComponentInChildren<Camera>().ScreenPointToRay(new Vector3(Screen.width / 2, Screen.height / 2));
        if (Physics.Raycast(ray , out hit, 3))
        {
            Interactable interactable = hit.collider.gameObject.GetComponent<Interactable>();
            if (interactable != null)
            {
                interactable.RayCastHitFromPlayerr();
            }
        }
    }
}
