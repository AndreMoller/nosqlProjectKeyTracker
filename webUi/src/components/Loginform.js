import React from "react";
import "./loginform.css";

//Sends user logininfo to app.js
const Loginform = (props) => {
    

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    const onLogin = () => {
        props.tryLogin(username, password, setMessage);
    }

    const onCreateUser = () => {
        props.tryCreateUser(username, password, setMessage);
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }
    
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }
    return (
        <div id="loginDiv">
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" className="form-control" placeholder="Username" onChange={handleChangeUsername}/><br></br>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" className="form-control" placeholder="Password" onChange={handleChangePassword}></input>
                <p>{message}</p>
                <input defaultValue="Login" id="loginButton" className="btn btn-primary" onClick={onLogin}></input>
                <input defaultValue="Register" id="loginButton" className="btn btn-danger" onClick={onCreateUser}></input>
            </form>
        </div>
    );
}

export default Loginform;
