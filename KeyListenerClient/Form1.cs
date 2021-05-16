using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace KeyListenerClient
{
    public partial class Form1 : Form
    {

        private String username;
        private String password;
        private KeyListener listener = new KeyListener();
        private static readonly HttpClient client = new HttpClient();

        public Form1()
        {
            
            InitializeComponent();
        }

       
        //saving credentials if valid
        private void saveCred_Click(object sender, EventArgs e)
        {
            this.username = this.UsernameTf.Text;
            this.password = this.passwordTf.Text;
            if (sync()) {
                listener.Subscribe();
                this.UsernameTf.Text = "";
                this.passwordTf.Text = "";

                this.button1.Enabled = true;
            }
            else {
                this.button1.Enabled = false;
                this.statusTf.Text = "Status: Invalid credentials"; 
            }

        }

        //Sending keyinfo to backend
        private Boolean sync() {
            

            var values = new Dictionary<String, String>();

            values.Add("username", this.username);
            values.Add("password", this.password);
            values.Add("data", JsonConvert.SerializeObject(listener.getKeyPressesAndReset()));

            var content = new FormUrlEncodedContent(values);

            var response = client.PostAsync("http://83.233.156.14:8081/saveclicks", content);

            Console.WriteLine(response.Result);
            if (response.Result.ReasonPhrase.Equals("Accepted")) {
                this.statusTf.Text = "Status: Listening | Last sync success";
                this.lastSyncTf.Text = "Last Sync: " + DateTime.Now;
                return true;
            }
            else
            {
                this.statusTf.Text = "Status: Listening | Last sync failed";
                return false;
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            sync();
        }
    }
}
