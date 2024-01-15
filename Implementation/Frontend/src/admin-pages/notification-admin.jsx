import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Approve from '../images/approve.png'
import Deny from '../images/deny.png'
import '../style.css';
import io from 'socket.io-client';

function NotificationAdmin() {
  const [notifications, setNotifications] = useState([]);
  const socket = io.connect("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to the server");
    
    socket.on("sentBack", (messageData) => {
      if (Array.isArray(messageData)) {
        // If messageData is an array, use it as-is
        setNotifications(messageData);
      } else if (typeof messageData === 'object') {
        // If messageData is an object, wrap it in an array
        setNotifications([messageData]);
      } else {
        console.error("Received unexpected messageData:", messageData);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });

  const buttonStyle = {
    backgroundColor: 'cyan',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '45px',
  };

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  };

  return (
    <div className="notification-container-admin">
      {notifications.map((notification) => (
        <div key={notification.id} className='notification-admin'>
          {notification.name} Requested: {notification.itemName}  Amount: {notification.amount} Description: {notification.description} Date: 12/12/2023
          <button className='buttonStyle'><img src={Approve} style={svgStyle} /></button>
          <button className='buttonStyle'><img src={Deny} style={svgStyle} /></button>
        </div>
      ))}
    </div>
  );
}

export default NotificationAdmin;
