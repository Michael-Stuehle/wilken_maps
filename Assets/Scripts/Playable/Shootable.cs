using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shootable : MonoBehaviour
{
    public GameObject damagePrefab;

    public delegate void DeathEventHandler();
    public event DeathEventHandler DeathEvent;

    public delegate void HitEventHandler(GameObject hitBy);
    public event HitEventHandler HitEvent;

    public bool canTakeDamage = true;

    public virtual void Start()
    {
        DeathEvent += () => Destroy(gameObject, 0.1f);
        HitEvent += NormalHitEvent;
    }

    private int hp = 100;
    public int HP
    {
        get
        {
            return hp;
        }

        set
        {
            if (canTakeDamage)
            {

                if (value < hp) // take damage
                {
                    //ShowDamage(hp - value);
                }
                if ((hp = value) <= 0)
                {
                    OnDeath();
                }
            }
        }
    }

    protected void ShowDamage(int damage)
    {
        GameObject obj = Instantiate(damagePrefab, transform);
        obj.GetComponent<Popup>().cam = GameObject.Find("Player").GetComponent<Camera>();
        obj.GetComponent<Popup>().text = damage.ToString();
    }

    protected void NormalHitEvent(GameObject hitBy)
    {
        int damage;
        if (hitBy != null)
        {
            gunScript gun = hitBy.GetComponent<gunScript>();
            damage = gun != null ? gun.damage : 0;
            HP -= damage;
            Debug.Log(damage);
        }
    }

    public void OnHit(GameObject hitBy)
    {
        HitEvent?.Invoke(hitBy);
    }

    public void OnDeath()
    {
        DeathEvent?.Invoke();
    }
}
