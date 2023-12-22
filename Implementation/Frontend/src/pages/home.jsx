import React from 'react';
import User from '../images/user.svg';

function Home() {
    return (
        <div className="icon-container">
            <div className="icons">
                <img id='sum' src={User} alt='' />
            </div>
            <div className="icons1"></div>
            <div className="icons2"></div>
        </div>
    );
}

export default Home;
