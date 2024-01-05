import { Link, useNavigate } from 'react-router-dom';
import Home from './home';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'

function Login() {
    const loginContainer = {
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgb(34, 41, 44)',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
    }
    const login = {
        width: '24%',
        height: '46vh',
        backgroundColor: 'rgb(56, 59, 61)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        gap: '23px',
        display: 'flex',
        padding: '8px 0px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const username = useRef();
    const password = useRef();

    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value] }))
    };
    axios.defaults.withCredentials = true;

    useEffect(()=>{
        axios.get('http://localhost:5500')
        .then(res => {
            if(res.data.valid) {
                navigate('/home');
            }else{
                navigate('/')
            }
        })
        .catch(err => console.log(err))
    }, [])
    const handleSubmit = (event) => {
        axios.post("http://localhost:5500/login", values)
        .then(res => {
            if(res.data.Login){
                localStorage.setItem("username", username.current.value);
                localStorage.setItem("password", password.current.value);
                localStorage.setItem("userID", res.data.id);
                localStorage.setItem("roleID", res.data.roleID);
                const userRole = res.data.roleID;
                if (userRole === 3){
                    navigate('/home-admin');
                }else if(userRole === 2){
                    navigate('/home-employee')
                }
            }else {
                alert("Not found")
            }
        })
        .catch(err => console.log(err));
    }
    return (
        <div style={loginContainer}>
            <div style={login}>
                <h1>Login</h1>
                <input placeholder='Username' type='text' name='username' onChange={handleInput} ref={username} />
                <input placeholder='Password' type='password' name='password' onChange={handleInput} ref={password} />
                <button onClick={handleSubmit}>Enter</button>
            </div>
        </div>
    );
}

export default Login;
