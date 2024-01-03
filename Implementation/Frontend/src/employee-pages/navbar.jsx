import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary logout actions, e.g., clearing session data
    // Redirect to the login page or another appropriate page after logout
    // For now, let's assume you just clear local storage and redirect to the home page
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="navbar">
      <ul className='ul1'>
        <li className='li1' onClick={handleLogout}><Link to={'/'}>Log Out</Link></li>
        <li className='li1'><Link to={'/home-employee'}>Home</Link></li>
      </ul>
      {/* <br /> */}
      <ul>
        <li><Link to={'/account-employee'}>Account</Link></li>
        <li><Link to={'/request-employee'}>Request</Link></li>
        <li><Link to={'/notification-employee'}>Notification</Link></li>
        <li><Link to={'/terms-employee'}>Terms and Conditions</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;
