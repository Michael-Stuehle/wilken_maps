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

           //doesnt work:
           // { "/register", (parameters) =>  Register(parameters) }, // /register USERNAME=PASSWORT
           // { "/login", (parameters) =>  LoginWith(parameters) },   // /login USERNAME=PASSWORT
        };

        tastenkombination = new TastenKombination(new KeyCode[] {
            KeyCode.UpArrow, KeyCode.UpArrow,
            KeyCode.DownArrow, KeyCode.DownArrow,
            KeyCode.LeftArrow, KeyCode.RightArrow,
            KeyCode.LeftArrow, KeyCode.RightArrow,
            KeyCode.B, KeyCode.A,
            KeyCode.Return
        }, true);

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

    bool checkPermissions()
    {
#if UNITY_EDITOR
        return true;
#else
        return Login.isDev;
#endif
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
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        GameObject gun = player.GetComponent<Steuerung>().gun;

        gun.SetActive(true);
        sendChatMessage("gun activated!");
    }

    void Fly()
    {
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        bool current = player.GetComponent<Steuerung>().allowFly;
        player.GetComponent<Steuerung>().allowFly = !current;
        sendChatMessage("fly " + (!current ? "aktiviert" : "deaktiviert"));
    }

    void Godmode()
    {
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        bool current = player.GetComponent<Steuerung>().canTakeDamage;
        player.GetComponent<Steuerung>().canTakeDamage = !current;
        sendChatMessage("godmode " + (current ? "aktiviert" : "deaktiviert"));
    }

    void Gamemode1()
    {
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        player.GetComponent<Steuerung>().allowFly = true;
        player.GetComponent<Steuerung>().canTakeDamage = false;
        sendChatMessage("gamemode updated");
    }

    void Gamemode0()
    {
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        player.GetComponent<Steuerung>().allowFly = false;
        player.GetComponent<Steuerung>().canTakeDamage = true;
        sendChatMessage("gamemode updated");
    }

    void NoClip()
    {
        if (!checkPermissions())
        {
            sendChatMessage("keine ausreichende Berechtigung");
            return;
        }
        bool current = player.GetComponent<Steuerung>().NoClip;
        player.GetComponent<Steuerung>().NoClip = !current;
        sendChatMessage("NoClip " + (!current ? "aktiviert" : "deaktiviert"));
    }

    void Tp(string parameters)
    {        
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

    void Register(string paramText)
    {
        string name = "";
        string passwort = "";
        try
        {
            paramText = paramText.Replace("\r", "").Replace("\n", "");
            name = paramText.Split('=')[0].Trim();
            passwort = paramText.Split('=')[1].Trim();
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
            sendChatMessage("syntaxfehler");
            return;
        }
        bool erfolg = Login.Register(name, passwort);
        sendChatMessage("registrieren " + (erfolg ? "" : "nicht ") + "erfolgreich");
    }

    void LoginWith(string paramText)
    {
        if (Login.isDev)
        {
            sendChatMessage("bereits angemeldet!");
            return;
        }
        string name = "";
        string passwort = "";
        try
        {
            paramText = paramText.Replace("\r", "").Replace("\n", "");
            name = paramText.Split('=')[0].Trim();
            passwort = paramText.Split('=')[1].Trim();
            bool erfolg = Login.checkLogin(name, passwort);
            sendChatMessage("login " + (erfolg ? "erfolgreich" : "fehlgeschlagen"));
        }
        catch
        {
            sendChatMessage("syntaxfehler");
        }
    }
}
