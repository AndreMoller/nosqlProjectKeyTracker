using Gma.System.MouseKeyHook;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace KeyListenerClient
{
    class KeyListener
    {
        private IKeyboardMouseEvents _globalHook;

        //key dictionary
        private Dictionary<String,int> values = new Dictionary<string, int>();

        //All allowed Keys
        private String allowedKeys = "qwertyuiopåasdfghjklöäzxcvbnm1234567890";

        //start listening
        public void Subscribe()
        {
            if (_globalHook == null)
            {
                _globalHook = Hook.GlobalEvents();
                _globalHook.KeyPress += GlobalHookKeyPress;
            }
        }

        //gets called every time a key is pressed
        private void GlobalHookKeyPress(object sender, KeyPressEventArgs e)
        {
            if (allowedKeys.Contains(e.KeyChar)) { 
                Console.WriteLine("KeyPress: \t{0}", e.KeyChar);
                if (values.ContainsKey(e.KeyChar.ToString().ToLower()))
                {
                    this.values[e.KeyChar.ToString().ToLower()]++;  
                }
                else {
                    values.Add(e.KeyChar.ToString().ToLower(), 1);
                }
            }
        }

        public Dictionary<String,int> getKeyPressesAndReset() {
            var tempValues = values;
            values = new Dictionary<string, int>();
            return tempValues;
        }

        private void Unsubscribe()
        {
            if (_globalHook != null)
            {
                _globalHook.KeyPress -= GlobalHookKeyPress;
                _globalHook.Dispose();
            }
        }
    }
}
