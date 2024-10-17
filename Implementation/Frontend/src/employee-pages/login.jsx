import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import Keys from '../keys.js'


const url = Keys.REACT_APP_BACKEND;

function Login() {

    const loginContainer = {
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgb(34, 41, 44)',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
    };

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
    };


    useEffect(() => {
        const func = async () => {
            try {
                const response = await axios.get(`${url}/category`);
                // const serverUrl=process.env.REACT_APP_BACKEND;
                console.log("Response: ", url);
            } catch (error) {
                console.error("Error Occured: ", error)
            }
        }

        func();

    }, [])

    const username = useRef();
    const password = useRef();

    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            "username": values.username,
            "password": values.password
        }
        console.log("VALUES: ", values.password);
        console.log("KEYS: ", url);
        axios.post(`${url}/login`, data)
            .then(res => {
                if (res.data.Login) {
                    localStorage.setItem("username", username.current.value);
                    localStorage.setItem("password", password.current.value);
                    localStorage.setItem("userID", res.data.id);
                    localStorage.setItem("roleID", res.data.roleID);
                    localStorage.setItem("email", res.data.email);
                    const userRole = res.data.roleID;

                    switch (userRole) {
                        case 3:
                            navigate('/home-admin');
                            break;
                        case 2:
                            navigate('/home-employee');
                            break;
                        case 5:
                            navigate('/home-supervisor');
                            break;
                        case 6:
                            navigate('/home-hr');
                            break;
                        case 4:
                            navigate('/home-employee');
                            break;
                        default:
                            alert("Not found")
                    }

                } else {
                    alert(`Not found`);
                }
            })
            .catch(err => console.log(err));
    }
    const button = {
        width: '55px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '12px',
        backgroundColor: 'black',
    }
    return (
        <div style={loginContainer}>
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={login}>

                    <h1>Login</h1>
                    <input placeholder='Username' type='text' className='inputTest' name='username' onChange={handleInput} ref={username} />
                    <input placeholder='Password' type='password' name='password' onChange={handleInput} ref={password} />
                    <button style={button} onClick={handleSubmit}>Enter</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
