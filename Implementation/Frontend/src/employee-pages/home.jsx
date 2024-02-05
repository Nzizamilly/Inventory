import React, { useState } from 'react';
import User from '../images/user.svg';
import Navbar from './navbar';
import Request from '../images/request.svg';
import Notification from '../images/notification.svg';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:5500')
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);
                } else {
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
        <Navbar></Navbar> 
        <div className="icon-container">
            <div className="icons">
                <img className='img1' src={User} alt='img1' />
                <p>Account: {name}</p>
            </div>
            <div className="icons1">
                <img className='img1' src={Request} alt='img2' />
                <p>Requests: ---</p>
            </div>
            <div className="icons2">
                <img className='img1' src={Notification} alt='img3' />
                <p>Notifications: ---</p>
            </div>
        </div>
        </div>
    );
}

export default Home;
