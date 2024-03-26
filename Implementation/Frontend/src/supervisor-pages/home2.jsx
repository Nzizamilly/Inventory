import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Select from 'react-select'

function Home2() {
    const color = {
        color: 'green'
    }
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    const [transactionType, setTransactionType] = useState('');

    const handleTransactionChange = (event) => {
        const selectedTransactionType = event.target.value;
        setTransactionType(event.target.value);

        if (selectedTransactionType === "item") {
            navigate('/notification-supervisor')
        } else {
            navigate('/purchase-supervisor')
        }
    };

    const select = {
        display: 'block',
        padding: '8px 16px',
        borderRadius: '12px',
        textDecoration: 'none',
        color: 'rgb(5, 5, 5)',
        width: '209px',
        backgroundColor: 'black',
        color: 'white'

    }

    return (
        <div className="navbar">
            <ul className='ulsupervisor' style={color}>
                <li className='li1supervisor'><Link to={'/home-supervisor'}>Home</Link></li>
                {/* <li className='li1supervisor'><Link to={'/notification-supervisor'}>View Requests</Link></li> */}
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Requests</option>
                    <option value="item" >Item</option>
                    <option value="purchase" >Purchase</option>
                </select>
                <li className='li1supervisor' onClick={handleLogout}><Link>Log Out</Link></li>
            </ul>
        </div>
    );
}

export default Home2;
