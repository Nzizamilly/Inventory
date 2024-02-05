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

    const handleApprove = async (notifications) => {
        try {
            await axios.post(`http://localhost:5500/request`, notifications);
            console.log("Request approved");
            const newStatus = true;
            window.alert("Request Sent to HR for Second-tier Approve")
            socket.emit("Approved_By_Supervisor", notifications, newStatus);
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
    // useEffect(() => {
    //   socket.on("sentBack", (messageData) => {
    //     console.log(messageData);
    //     if (Array.isArray(messageData)) {
    //       setNotifications((prevNotifications) => [...prevNotifications, ...messageData]);
    //     } else if (typeof messageData === 'object') {
    //       setNotifications((prevNotifications) => [...prevNotifications, messageData]);
    //     } else {
    //       console.error("Received unexpected messageData:", messageData);
    //     }
    //   })
    // }, [socket])

    useEffect(() => {
        socket.on("sentBack", (messageData) => {
            setNotifications([...notifications, messageData]);
        });

    }, [socket, notifications]);

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                {notifications.map((notification, index) => {
                    console.log("Data in the div", notification);
                    const employeeName = notification[0].employeeName;
                    const itemName = notification[0].itemName;
                    const categoryName = notification[0].categoryName;
                    const description = notification[0].description;
                    const date = notification[0].date;
                    const count = notification[0].count;

                    return (
                        <div style={notificationAdmin} key={index}>
                            <span key={index} style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName} Amount: {count} Description: {description} Date: {date}</span>
                            <button className='buttonStyle3' onClick={() => handleApprove(notification.id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
                            <button className='buttonStyle3' onClick={() => handleDeny(notification.id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
                        </div>
                    )
                })}




            </div>
      // </div>
    );
}
export default NotificationHR;
