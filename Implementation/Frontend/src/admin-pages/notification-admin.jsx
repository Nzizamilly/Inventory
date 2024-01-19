import React, { useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Approve from '../images/approve.png';
import Deny from '../images/deny.png';

function NotificationAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('');

  const socket = io.connect("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to the server");

    socket.on("sentBack", (messageData) => {
      if (Array.isArray(messageData)) {
        console.log("Name: ", messageData.employeeName)
        setNotifications(messageData);
      } else if (typeof messageData === 'object') {
        console.log("Name: ", messageData.employeeName)
        setNotifications([messageData]);
      } else {
        console.error("Received unexpected messageData:", messageData);
      }
    });

    socket.on("statusUpdate", (newStatus) => {
      setStatus(newStatus);
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });

  const buttonStyle = {
    backgroundColor: 'white',
    // color: 'white',
    // padding: '0px 0px',
    // borderRadius: '45px',
    // marginTop: '0px'
  };

  const svgStyle = {
    width: '27px',
    height: '27px',
    borderRadius: '14px',
    // marginTop: '2px'
  };

const sumStyle = {
  marginTop: '24px',
  marginLeft: '2px'
}  

  const notificationAdmin = {
    width: '44%',
    height: '11%',
    textAlign: 'center',
    gap: '6px',
    border: 'none',
    display: 'flex',
    flexDirection: ' row',
    marginLeft: '300px',
    borderRadius: '15px',
    padding: '7px',
    color: 'black',
    backgroundColor: 'white'
  }

  const handleApprove = async (notifications) => {
    try {
      await axios.post(`http://localhost:5500/request`, notifications);
      console.log("Request approved");
      const newStatus = true;
      socket.emit("Approved", notifications, newStatus);
    } catch {
      console.log('Error');
    }
  }

  const handleDeny = async (notifications) => {
    try {
      const newStatus = false;
      // Update the status locally before emitting the event
      setStatus(newStatus);
      socket.emit("Denied", notifications, newStatus);
    } catch {
      console.log('Error');
    }
  }

  return (
    <div className="notification-container-admin">
      {notifications.map((notification) => (
        <div key={notification.id} style={notificationAdmin}>
          <p style = {sumStyle}> {notification.employeeName} Requested: {notification.itemName}  Amount: {notification.amount} Description: {notification.description} Date: 12/12/2023</p>
          <button className='buttonStyle' onClick={() => handleApprove(notification)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
          <button className='buttonStyle' onClick={() => handleDeny(notification)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
        </div>
      ))}
    </div>
  );
}

export default NotificationAdmin;
