import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


function Home3() {
    const color = {
        color: 'green'
    }
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    return (
        <div >
            <ul className='ul1' >
                <li className='li1'><Link to={'/home-hr'}>Home</Link></li>
                <li className='li1'><Link to={'/notification-hr'}>View Requests</Link></li>
                <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
            </ul>

        </div>
    );
}

export default Home3;
