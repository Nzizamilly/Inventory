import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


function Home2() {
    const color = {
        color: 'green'
    }
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    return (
        <div className="navbar">
            <ul className='ulsupervisor' style={color}>
                <li className='li1supervisor'><Link to={'/home-supervisor'}>Home</Link></li>
                <li className='li1supervisor'><Link to={'/notification-supervisor'}>View Requests</Link></li>
                <li className='li1supervisor' onClick={handleLogout}><Link>Log Out</Link></li>
            </ul>

        </div>
    );
}

export default Home2;
