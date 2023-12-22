import { Link } from 'react-router-dom';
import React from 'react';

function Request() {
  return (
    <div className="request-container">
      <form className='request'>
        <h1>Request</h1>
        <input  placeholder='Item name' name='name'/>
        <input  placeholder='Amount' name='amount'/>
        <textarea name='description'>Description</textarea>
        <button><Link to={'/'}>Send</Link></button>
      </form>
    </div>
  );
}

export default Request;
