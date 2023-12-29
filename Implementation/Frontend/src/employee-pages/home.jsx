import React from 'react';
import User from '../images/user.svg';
import Request from '../images/request.svg';
import Notification from '../images/notification.svg';

function Home() {
    return (
        <div className="icon-container">
            <div className="icons">
                <img className='img1' src={User} alt='img1' />
                <p>Account: Pain</p>
            </div>
            <div className="icons1">
                <img className='img1' src={Request} alt='img2' />
                <p>Requests: 32</p>
            </div>
            <div className="icons2">
                <img className='img1' src={Notification} alt='img3' />
                <p>Notifications: 2</p>
            </div>
        </div>
    );
}

export default Home;
