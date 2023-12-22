import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="account">
      <form action="">
        <input placeholder='Username' type='text' name='username'/>
        <input placeholder='Password' type='password' name='password'/>
        <button><Link to={'/account'}>Enter</Link></button>
      </form>
    </div>
  );
}

export default Login;
