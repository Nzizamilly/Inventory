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
    const [takeSupervisorID, setTakeSupervisorID] = useState('');

    const socket = io.connect("http://localhost:5001");

    socket.on("connect", () => {
        // console.log("Connected to the server");
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
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px 12px',
    }

    const notificationAdmin = {
        textAlign: 'center',
        gap: '6px',
        border: 'none',
        display: 'flex',
        flexDirection: ' row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px',
        padding: '7px',
        color: 'black',
        backgroundColor: 'white'
    }

    const handleApprove = async (notifications, index) => {
        window.alert("Sent to Stock-Manager for Deliverance");
        socket.emit("Take This", notifications);
        socket.emit("Send Approved Email", notifications);
        try {
            console.log("Notifications to be passed: ", notifications);

            const putResponse = await axios.post('http://localhost:5500/post-by-hr', notifications);
        } catch (error) {
            console.error('Error', error);
        }
    };




    const handleDeny = async (index, notification) => {
        socket.emit("Denied_By_Either(1)", notification);
        try {
            const updatedNotifications = notifications.filter((_, i) => i !== index);
            setNotifications(updatedNotifications);

            await axios.put(`http://localhost:5500/deny-by-supervisor/${index}`);
        } catch (error) {
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get("http://localhost:5500/get-notifications");
                const result = response.data;
                const supervisorID = result.supervisorID;
                setTakeSupervisorID(supervisorID);
                setNotifications(result);
            } catch (error) {
                console.error(error)
            }
        };
        fetch();
    }, [notifications])

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                {notifications.map((notification) => {
                    // console.log("Data in the div", notification.username);
                    const employeeName = notification.employee_username;
                    const itemName = notification.name;
                    const categoryName = notification.category_name;
                    const description = notification.description;
                    const date = notification.date_approved;
                    const count = notification.amount;
                    const id = notification.id;
                    const supervisor = notification.supervisor_username
                    return (
                        <div style={notificationAdmin} key={id}>
                            <span key={id} style={sumStyle}>Supervisor {supervisor} Approved request from {employeeName} of {itemName} amount: {count} in {categoryName} category, description: {description} On {date} </span>
                            <button className='buttonStyle3' onClick={() => handleApprove(notification, id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
                            <button className='buttonStyle3' onClick={() => handleDeny(id, notification)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default NotificationHR;
