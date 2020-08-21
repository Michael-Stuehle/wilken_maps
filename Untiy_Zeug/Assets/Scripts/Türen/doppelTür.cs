using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class doppelTür : Tür
{
    public doppelTür andereTür;

    protected override void DoorOpenClose()
    {
        base.DoorOpenClose();
        andereTür.open = open;
        andereTür.currentRotationAngle = andereTür.transform.localEulerAngles.y;
        andereTür.openTime = 0;
    }
}
