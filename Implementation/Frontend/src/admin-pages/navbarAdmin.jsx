import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

function NavbarAdmin() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Perform any necessary logout actions, e.g., clearing session data
    // Redirect to the login page or another appropriate page after logout
    // For now, let's assume you just clear local storage and redirect to the home page
    localStorage.clear();
    navigate('/');
  };
  return (
    <div className="navbarAdmin">
      <ul className='ul1Admin'>
        <li className='li1Admin' onClick={handleLogout}><Link to={'/'}>Log Out</Link></li>
        <li className='li1Admin'><Link to={'/home-admin'}>Home</Link></li>
      </ul>
      <ul className='ul2Admin'>
        <li className='liAdmin'><Link to={'/account-admin'}>Account</Link></li>
        <li className='liAdmin'><Link to={'/items-admin'}>Items</Link></li>
        <li className='liAdmin'><Link to={'/employees-admin'}>Employees</Link></li>
        <li className='liAdmin'><Link to={'/category-admin'}>Category</Link></li>
        <li className='liAdmin'><Link to={'/notification-admin'}>Notification</Link></li>
        <li className='liAdmin'><Link to={'/transaction-admin'}>Transactions</Link></li>
        <li className='liAdmin'><Link to={'/supplier-admin'}>Suppliers</Link></li>
        <li className='liAdmin'><Link to={'/terms-admin'}>Terms and Conditions</Link></li>
      </ul>
      
    </div>
  );
}
export default NavbarAdmin;
