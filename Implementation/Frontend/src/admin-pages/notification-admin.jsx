import { Link } from 'react-router-dom';
import React from 'react';
import Approve from '../images/approve.png'
import Deny from '../images/deny.png'
import'../style.css'
// import io from 'socket.io-client'

function NotificationAdmin() {

  // const socket = io.connect("http://localhost:5001");
  // const s
  
    const buttonStyle = {
      backgroundColor: 'cyan',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '45px',
    };
    const svgStyle={
      // backgroundColor: 'green',
      width: '30px',
      height: '30px',
      borderRadius: '14px',
      marginTop: '2px'
    }
    const svgStyleCross={
      backgroundColor: 'red',
      width: '40px',
      height: '30px',
      borderRadius: '14px',
      marginTop: '1px'
    }
  return (
    <div className="notification-container-admin">
        <div className='notification-admin'>Painter requested: POS 2 Date: 12/12/2023  
        <button className='buttonStyle'><img src={Approve} style={svgStyle} /></button>
        <button className='buttonStyle'><img src={Deny} style={svgStyle} /></button>
        </div>
    </div>
  );
}

export default NotificationAdmin;
