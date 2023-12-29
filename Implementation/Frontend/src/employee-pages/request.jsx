import { Link } from 'react-router-dom';
import React from 'react';

function Request() {
  return (
    <div className="request-container">
      <form className='request'>
        <h1>Request</h1>
        <input placeholder='Item name' type='text' name='name' />
        <input placeholder='Amount' type='text' name='amount' />
        <textarea name='description'>Description</textarea>
        <Link to={'/'}><button>Send</button></Link>
      </form>
    </div>
  );
}

export default Request;
