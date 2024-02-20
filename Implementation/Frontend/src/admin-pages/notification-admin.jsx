import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import io from 'socket.io-client';
import axios from 'axios';

function NotificationAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('');
  const [supervisor, setSupervisor] = useState('');

  const socket = io.connect("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to the server");
    socket.on("statusUpdate", (newStatus) => {
      setStatus(newStatus);
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });



  const notificationAdmin = {
    textAlign: 'center',
    gap: '6px',
    border: 'none',
    display: 'flex',
    marginLeft: '50px',
    flexDirection: ' row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px',
    padding: '7px',
    color: 'black',
    backgroundColor: 'white'
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:5500/get-notifications");
        setNotifications(response.data)
      }catch(error){
        console.error("Error: ", error);
      }
    }
    fetch();

  },[])

  const sumStyle = {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 12px',
}

  return (
    <div> <NavbarAdmin></NavbarAdmin>
      <div className="notification-container-admin">
        {notifications.map((notification) => {
          return (
            <div key={notification.id} style={notificationAdmin}>
            <span style={sumStyle}> HR Approved request from {notification.employee_username} through {notification.supervisor_username} of {notification.name} in {notification.category_name}, amount: {notification.amount} description {notification.description}, date {notification.date_approved}</span>
          </div>
            )
        })}
      </div>
    </div>
  );
}
export default NotificationAdmin;