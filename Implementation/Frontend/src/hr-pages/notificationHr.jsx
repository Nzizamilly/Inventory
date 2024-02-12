import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarMain from './navbarMain.jsx';
import Modal from 'react-modal'

function NotificationHR() {
    const [notifications, setNotifications] = useState([]);
    const [supervisor, setSupervisor] = useState('');
    const [status, setStatus] = useState('');

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

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        width: '40px',
        padding: '0px 0px',
        borderRadius: '45px',
        marginTop: '0px'
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
        width: '64%',
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

    const handleApprove = async (notifications, index) => {
        const updatedNotification = supervisor;
        socket.emit("HR_Message_Stock(1)", notifications, updatedNotification);
        socket.emit("Approved_By_Either(1)", notifications);
        try {
            console.log("Index: ", index);
            await axios.put(`http://localhost:5500/approve-by-supervisor/${index}`);
            window.alert("Sent to Stock-Manager for Deliverance");
        } catch(error) {
            console.error('Error', error);
        }
    }

    const handleDeny = async (index, notification) => {
        console.log("Notifications id :", index);
        socket.emit("Denied_By_Either(1)", notification);
        try {
          const updatedNotifications = notifications.filter((_, i) => i !== index);
          setNotifications(updatedNotifications);
      
          await axios.put(`http://localhost:5500/deny-by-supervisor/${index}`);
        } catch (error) {
          console.log('Error', error);
        }
      }
      
    
    useEffect(() => {
        socket.on("Supervisor_Message_HR(2)", (messageData, supervisorName) => {
            setSupervisor(supervisorName);
            setNotifications([...notifications, { ...messageData, supervisor: supervisorName }]);
        });

    }, [socket, notifications]);


    console.log("Supervisor name fom notification", notifications);

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                {notifications.map((notification) => {
                    console.log("Data in the div", notification);
                    const employeeName = notification[0].employeeName;
                    const itemName = notification[0].itemName;
                    const categoryName = notification[0].categoryName;
                    const description = notification[0].description;
                    const date = notification[0].date;
                    const count = notification[0].count;
                    // const supervisor = notification[0].supervisor;
                    //   const employeeName = notification.employeeName;
                    // const itemName = notification.itemName;
                    // const categoryName = notification.categoryName;
                    // const description = notification.description;
                    // const date = notification.date;
                    // const count = notification.count;
                    return (
                        <div style={notificationAdmin} key={notification[0].id}>
                            <span key={notification[0].id} style={sumStyle}>Supervisor {supervisor} Approved request from {employeeName} of {itemName} amount {count} in {categoryName} category, description {description} date {date} </span>
                            {/* <span key={index} style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName} Amount: {count} Description: {description} Date: {date}</span> */}
                            <button className='buttonStyle3' onClick={() => handleApprove(notification, notification[0].id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
                            <button className='buttonStyle3' onClick={() => handleDeny(notification[0].id, notification)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default NotificationHR;
