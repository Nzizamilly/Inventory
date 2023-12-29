import { Link } from 'react-router-dom';
import Home from './home';
import React from 'react';

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
    return (
        <div style={loginContainer}>
            <div style={login}>
                <h1>Login</h1>
                <input placeholder='Username' type='text' name='username' />
                <input placeholder='Password' type='text' name='password' />
                <Link to={'/home'}><button>Send</button></Link>
            </div>
        </div>
    );
}

export default Login;
