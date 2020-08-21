using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class dog : Shootable
{
    void Start()
    {
        HitEvent += (hitby) =>
        {
            hitby.GetComponentInParent<Shootable>().OnDeath();
        };
    }
}
