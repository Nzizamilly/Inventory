import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Approve from '../images/approve.png';
import Deny from '../images/deny.png';
import NavbarAdmin from './navbarAdmin';

function NotificationAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('');

  const socket = io.connect("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to the server");

    // socket.on("sentBack", (messageData) => {
    //   console.log("Receiving messageData: ", messageData);
    //   const messageId = `message-${messageData.id}`;
    //   const allMessages = document.getElementById(messageId);

    //   if(allMessages){
    //     const p = document.createElement("p");
    //     p.innerText = messageData;
    //     allMessages.appendChild(p);
    //   }else{
    //     const newDiv = document.createElement("div");
    //     newDiv.id = messageId;

    //     const p = document.createElement("p");
    //     p.innerText = messageData;
    //     newDiv.appendChild(p);

    //     const notificationContainer = document.querySelector(".notification-coontainer-admin");
    //     notificationContainer.appendChild(newDiv);
    //   }
    // });



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
    // width: '14%',
    // height: '11%',
    textAlign: 'center',
    gap: '6px',
    border: 'none',
    display: 'flex',
    flexDirection: ' row',
    // marginLeft: '300px',
    justifyContent: 'center',
    alignItems: 'center',
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
  useEffect(() => {
    socket.on("sentBack", (messageData) => {
      console.log(messageData);
      if (Array.isArray(messageData)) {
        setNotifications((prevNotifications) => [...prevNotifications, ...messageData]);
      } else if (typeof messageData === 'object') {
        setNotifications((prevNotifications) => [...prevNotifications, messageData]);
      } else {
        console.error("Received unexpected messageData:", messageData);
      }
    })
  }, [socket])
  return (
    <div> <NavbarAdmin></NavbarAdmin>
      <div className="notification-container-admin">
        {notifications.map((notification) => (
          <div key={notification.id} style={notificationAdmin}>
            <p style={sumStyle}> {notification.employeeName} Requested: {notification.itemName}  From: {notification.categoryName} Amount: {notification.count} Description: {notification.description} Date: {notification.date}</p>
            <button className='buttonStyle' onClick={() => handleApprove(notification)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
            <button className='buttonStyle' onClick={() => handleDeny(notification.id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationAdmin;
