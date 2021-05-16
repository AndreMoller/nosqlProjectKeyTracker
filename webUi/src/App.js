import './App.css';
import $ from 'jquery';
import React from "react";
import Loginform from './components/Loginform';
import {useEffect} from "react";

//main app contains all tables 
function App() {

  const url = "http://83.233.156.14:8081/";

  const [hide, setHide] = React.useState(false);
  const [data, setData] = React.useState({});
  const [toplist, setToplist] = React.useState([]);
  const [username, setUsername] = React.useState({});
  const [password, setPassword] = React.useState({});


  
  //Controls/updates the heatmap
  useEffect(() => {
    var heatkeys = "";
    for(var key of Object.keys(data)){
      for(var i = 0; i < data[key]; i++){
        heatkeys += key;
      }
    }
    document.getElementById("typefield").value = heatkeys;
    setTimeout(() => {
      document.getElementById("typefield").dispatchEvent(new Event("input"));
    }, 1000)
  }, [data])


  //Gets all userkeys for a specific user and toplist
  const getData = (username, password) => {

    $.ajax({
      url: url+"getdata",
      type: 'get',
      crossDomain: true,
      headers: {
        'username': username,
        'password': password
      },
      dataType: 'json',
      success: (data) => {
        console.log((data));
        setData(data);
      },
      error: (err) => {

        console.log("something went wrong");

      }
    });

    $.ajax({
      url: url+"toplist",
      type: 'get',
      crossDomain: true,
      dataType: 'json',
      success: (data) => {
        console.log(data);
        setToplist(data);
      },
      error: (err) => {
        console.log("something went wrong");
      }
    });

  }

  //updates keys and toplist
  const refreshData = () => {

    $.ajax({
      url: url+"getdata",
      type: 'get',
      crossDomain: true,
      headers: {
        'username': username,
        'password': password
      },
      dataType: 'json',
      success: (data) => {
        setData(data);
      },
      error: (err) => {

        console.log("something went wrong");

      }
    });

    $.ajax({
      url: url+"toplist",
      type: 'get',
      crossDomain: true,
      dataType: 'json',
      success: (data) => {
        console.log(data);
        setToplist(data);
      },
      error: (err) => {
        console.log("something went wrong");
      }
    });

  }

  //Checks of username and password combo is legit
  const tryLogin = (username, password, setMessage) => {

    $.ajax({
      url: url+"auth",
      type: 'post',
      crossDomain: true,
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: () => {

      },
      error: (err) => {
        if (err.status == 401) {
          setMessage("Wrong password or username");
        } else {
          setPassword(password);
          setUsername(username);
          getData(username, password);
          setHide(true);     
        }
      }
    });
  }

  //Attemnts to create a new user
  const tryCreateUser = (username, password, setMessage) => {


    $.ajax({
      url: url+"createuser",
      type: 'post',
      crossDomain: true,
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: () => {

      },
      error: (err) => {
        if (err.status === 200) {
          setMessage("User created");
        } else {
          setMessage("User already exist");
        }
      }
    });
  }


  return (
    <div className="App">
      {hide ? "" : <Loginform tryLogin={tryLogin} tryCreateUser={tryCreateUser} />}
      {!hide ? "" :
        <div className="tablediv">
          <button className="btn btn-primary" onClick={refreshData}>Refresh</button>
          <table className="toplist">
          <h2>Toplist</h2>
            <tr>
              <th>Username</th>
              <th>Amount of clicks</th>
            </tr>

            {toplist.map((user) =>
              <tr>
                <td>{user.username}</td>
                <td>{user.total}</td>
              </tr>
            )}
          </table>
          <table className="userdata">
          <h2>Your keys</h2>
            <tr>
              <th>Key</th>
              <th>Amount of clicks</th>
            </tr>
            {Object.keys(data).map((key) =>
              <tr >
                <td>{key}</td>
                <td>{data[key]}</td>
              </tr>
            )}
          </table>
        </div>
      }
    </div>
  );
}

export default App;
