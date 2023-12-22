import { Link } from 'react-router-dom';
import React from 'react';

function Navbar() {
  return (
    <div className="navbar">
      <ul>
        <li><Link to={'/account'}>Account</Link></li>
        <li><Link to={'/request'}>Request</Link></li>
        <li><Link to={'/notification'}>Notification</Link></li>
        <li><Link to={'/terms'}>Terms and Conditions</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;
