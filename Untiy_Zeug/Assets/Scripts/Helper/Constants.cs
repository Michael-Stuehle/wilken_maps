using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Helper
{
    class Constants
    {
        public const float GAMESPEED = 5.0f;
        public const string INP_START_DEFAULT = "aktuelle position";
        public const string DEATH_SCENE = "Death_Scene";
        public const string GAME_SCENE = "SampleScene";
        public const string SPIELER_OBJEKT_NAME = "Player";

        public static readonly Vector3 RAUM_NOT_FOUNT_COORDS = new Vector3(int.MinValue, int.MinValue, int.MinValue);
        public static readonly Vector3 AKTUELLE_POSITION_COORDS = new Vector3(int.MaxValue, int.MaxValue, int.MaxValue);
    }
}
