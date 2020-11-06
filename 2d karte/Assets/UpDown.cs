using Assets;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UpDown : MonoBehaviour
{
    bool mouseIsOver = false;
    float scaleMultiplier = 1.5f;

    int direction
    {
        get
        {
            if (Mathf.Abs(transform.eulerAngles.y) < 5)
            {
                return +1;
            }else
            {
                return -1;
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (mouseIsOver)
        {
            if (Input.GetMouseButtonDown(0))
            {
                GameObject.Find("Main").GetComponent<Main>().AktuelleEtageIndex += direction;
            }
        }
    }

    private void OnMouseEnter()
    {
        mouseIsOver = true;
        transform.localScale *= scaleMultiplier;
        transform.position += new Vector3(1, 0, -1)*direction;
    }

    private void OnMouseExit()
    {
        mouseIsOver = false;
        transform.localScale /= scaleMultiplier;
        transform.position -= new Vector3(1, 0, -1)*direction;
    }
}
