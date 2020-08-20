using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Helper
{
    static class CustomKeyCode
    {
        static CustomKeyCode()
        {
            /* load:
             *   db             --> node.js server
             *   node.js server --> js iframe
             *   js iframe      --> clientObj
             *   clientObj event onload --> hier
            */
        }

        private static KeyCode interactionKey = KeyCode.F;
        public static KeyCode InteractionKey
        {
            get => interactionKey;
            set => interactionKey = value;
        }

        private static KeyCode menuOpenCloseKey = KeyCode.T;
        public static KeyCode MenuOpenCloseKey
        {
            get => menuOpenCloseKey;
            set => menuOpenCloseKey = value;
        }

        private static KeyCode sprintKey = KeyCode.LeftShift;
        public static KeyCode SprintKey
        {
            get => sprintKey;
            set => sprintKey = value;
        }

        private static KeyCode sneakKey = KeyCode.LeftControl;
        public static KeyCode SneakKey
        {
            get => sneakKey;
            set => sneakKey = value;
        }
    }
}
