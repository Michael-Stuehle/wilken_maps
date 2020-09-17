using Assets.Scripts.Helper;
using Assets.Scripts.UI;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class CommandLine : MonoBehaviour
{
    public GameObject commandLine;
    public GameObject chat;
    public delegate void ActionEventHandler(string parameters);
    public GameObject player;

    string inputText;

    TastenKombination tastenkombination;

    Dictionary<string, ActionEventHandler> commands;

    void Awake()
    {
        tastenkombination = new TastenKombination(new KeyCode[] {
            KeyCode.UpArrow, KeyCode.UpArrow,
            KeyCode.DownArrow, KeyCode.DownArrow,
            KeyCode.LeftArrow, KeyCode.RightArrow,
            KeyCode.LeftArrow, KeyCode.RightArrow,
            KeyCode.B, KeyCode.A,
            KeyCode.Return
        }, true);
    }

    // Start is called before the first frame update
    void Start()
    {
        commandLine.SetActive(false);
        chat.SetActive(false);

        // WICHTIG:  nur lowercase verwenden
        commands = new Dictionary<string, ActionEventHandler>()
        {
            { "/activate gun", (noParams) => ActivateGun() },
            { "/gamemode 1", (noParams) =>  Gamemode1() },
            { "/gamemode creative", (noParams) =>  Gamemode1() },
            { "/gamemode 0", (noParams) =>  Gamemode0() },
            { "/gamemode survival", (noParams) =>  Gamemode0() },
            { "/fly", (noParams) =>  Fly() },
            { "/godmode", (noParams) =>  Godmode() },
            { "/noclip", (noParams) =>  NoClip() },
            { "/tp", (parameters) =>  Tp(parameters) }
        };

        commandLine.GetComponent<InputField>().onValueChanged.AddListener(TextChanged);

        tastenkombination.KeyCombinationFoundEvent += () =>
        {
            commandLine.tag = "menuObject"; // zum menü hinzufügen
            chat.tag = "menuObject";
            Menu menu = GameObject.Find("Menu").GetComponent<Menu>();
            menu.menuObjects.Add(commandLine);
            menu.menuObjects.Add(chat);
            menu.OnPause();
        };
    }

    // Update is called once per frame
    void Update()
    {
        tastenkombination.Update();
        if (GameObject.Find("Menu").GetComponent<Menu>().Paused) // nur während pausiert ist
        { 
            if (inputText != null && inputText != "")
            {
                if (Input.GetKeyDown(KeyCode.Return))
                {
                    executeCommand();
                }
            }
        }
    }

    ActionEventHandler findCommand(string text, out string parameters)
    {
        parameters = "";
        if (!text.StartsWith("/")) return null;
        
        foreach (var item in commands)
        {
            if (text.ToLower().StartsWith(item.Key.ToLower()))
            {
                parameters = Regex.Replace(text, item.Key, "", RegexOptions.IgnoreCase);
                return item.Value;
            }
        }
        return null;
    }

    void executeCommand()
    {
        string parameters;
        ActionEventHandler action = findCommand(inputText, out parameters);
        if (action != null)
        {
            sendChatMessage(inputText);
            action.Invoke(parameters);
        }
        else // command und nicht gefunden
        {
            sendChatMessage("ungültige eingabe: ");
            sendChatMessage(inputText);
        }
        commandLine.GetComponent<InputField>().text = "";
    }

    bool checkPermissions(string action)
    {
        bool allowed = Login.ActionIsAllowed(action.ToLower());
        if (!allowed)
        {
            sendChatMessage("keine ausreichende Berechtigung");
        }
        return allowed;        
    }

    public void sendChatMessage(string message)
    {
        chat.GetComponent<TextMeshProUGUI>().text += "\n\r" + message;
    }

    void TextChanged(string text)
    {
        inputText = text;
    }

    void ActivateGun()
    {
        if (!checkPermissions("activate gun"))
        {
            return;
        }
        gunScript gun = player.GetComponent<Steuerung>().gun.GetComponent<gunScript>();

        gun.IsEnabled = true;
        sendChatMessage("gun activated!");
    }

    void Fly()
    {
        if (!checkPermissions("fly"))
        {
            return;
        }
        bool current = player.GetComponent<Steuerung>().allowFly;
        player.GetComponent<Steuerung>().allowFly = !current;
        sendChatMessage("fly " + (!current ? "aktiviert" : "deaktiviert"));
    }

    void Godmode()
    {
        if (!checkPermissions("godmode"))
        {
            return;
        }
        bool current = player.GetComponent<Steuerung>().canTakeDamage;
        player.GetComponent<Steuerung>().canTakeDamage = !current;
        sendChatMessage("godmode " + (current ? "aktiviert" : "deaktiviert"));
    }

    void Gamemode1()
    {
        if (!checkPermissions("gamemode1"))
        {
            return;
        }
        player.GetComponent<Steuerung>().allowFly = true;
        player.GetComponent<Steuerung>().canTakeDamage = false;
        sendChatMessage("gamemode updated");
    }

    void Gamemode0()
    {
        if (!checkPermissions("gamemode0"))
        {
            return;
        }
        player.GetComponent<Steuerung>().allowFly = false;
        player.GetComponent<Steuerung>().canTakeDamage = true;
        sendChatMessage("gamemode updated");
    }

    void NoClip()
    {
        if (!checkPermissions("noclip"))
        {
            return;
        }
        bool current = player.GetComponent<Steuerung>().NoClip;
        player.GetComponent<Steuerung>().NoClip = !current;
        sendChatMessage("NoClip " + (!current ? "aktiviert" : "deaktiviert"));
    }

    void Tp(string parameters)
    {
        if (!checkPermissions("tp"))
        {
            return;
        }
        string[] coords = parameters.Replace(" ", ";").Split(';');
        Vector3 tpPos = Constants.RAUM_NOT_FOUNT_COORDS;
        Vector3 temp = helperMethods.lookupCoordsFuerRaum(coords[1]);
        if (coords.Length == 2 && temp != Constants.RAUM_NOT_FOUNT_COORDS)
        {
            tpPos = temp;
        }
        else if (coords.Length < 4)
        {
            sendChatMessage("syntaxfehler: erwartet \"/tp x y z\" (\"~\" für aktuelle position)");
        }
        else
        {
            string s = coords[1];
            if (s == "~")
            {
                tpPos.x = player.transform.position.x;
            }
            else
            {
                tpPos.x = float.Parse(s);
            }
            
            s = coords[2];
            if (s == "~")
            {
                tpPos.y = player.transform.position.y;
            }
            else
            {
                tpPos.y = float.Parse(s);
            }
            
            s = coords[3];
            if (s == "~")
            {
                tpPos.z = player.transform.position.z;
            }
            else
            {
                tpPos.z = float.Parse(s);
            }
        }
        if (tpPos != Constants.RAUM_NOT_FOUNT_COORDS)
        {
            player.GetComponent<CharacterController>().enabled = false;
            player.transform.position = tpPos;
            player.GetComponent<CharacterController>().enabled = true;
        }
    }
}
