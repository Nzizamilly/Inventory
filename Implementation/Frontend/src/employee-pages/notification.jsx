import React, { useState } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';

function Notification() {
  const [notification, setNotification] = useState([]);
  const [status, setStatus] = useState('');

  const socket = io.connect("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to the server");

    socket.on("Approved", (notifications) => {
      setNotification(notifications);
      setStatus(true);
    });
    
    socket.on("Denied", (notifications) => {
      setNotification(notifications);
      setStatus(false);
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
  });

  const notificationStyle = {
    color: status ? 'green' : 'red',
  };

  return (
    <div>
      <Navbar></Navbar>
    <div className="notification-container">
      <div className="notification" style={notificationStyle}>
        <span>
          Admin {status ? 'Approved' : 'Denied'}: {notification.length > 0 ? `${notification[0].itemName} ${notification[0].amount}` : 'No notification'} Date: 12/12/2023
        </span>
      </div>
      </div>
    </div>
  );
}

export default Notification;
