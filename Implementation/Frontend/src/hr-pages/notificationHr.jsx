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
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px 12px',
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
        color: 'black',
        backgroundColor: 'white'
    }
    // const updatedNotification = supervisor;
    // socket.emit("HR_Message_Stock(1)", notifications, updatedNotification);
    // socket.emit("Approved_By_Either(1)", notifications);
    
    const handleApprove = async (notifications, index) => {
        // window.alert("Sent to Stock-Manager for Deliverance");

        try {
          console.log("Index: ", index);

          const putResponse = await axios.put(`http://localhost:5500/approve-by-supervisor/${index}`);

          console.log('PUT Request Successful', putResponse.data);

          const postResponse = await axios.post('http://localhost:5500/post-by-hr', notifications);

          console.log('POST Request Successful', postResponse.data);
        } catch (error) {
          console.error('Error', error);
        }
      };


 
    
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
        const fetch = async () => {
            const response = await axios.get("http://localhost:5500/get-notifications");
            const result = response.data;
            const supervisorID = result.supervisorID;
            setTakeSupervisorID(supervisorID);
            console.log("DATA FROM ENDPOINT: ", result);
            setNotifications(result);
        };
        fetch();
    }, [notifications])
    console.log("Supervisor name fom notification", notifications);

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                {notifications.map((notification) => {
                    console.log("Data in the div", notification.username);
                    const employeeName = notification.employee_username;
                    const itemName = notification.name;
                    const categoryName = notification.category_name;
                    const description = notification.description;
                    const date = notification.date_of_request;
                    const count = notification.amount;
                    const id = notification.id;
                    const supervisor = notification.supervisor_username
                    // const supervisor = notification[0].supervisor;
                    //   const employeeName = notification.employeeName;
                    // const itemName = notification.itemName;
                    // const categoryName = notification.categoryName;
                    // const description = notification.description;
                    // const date = notification.date;
                    // const count = notification.count;
                    return (
                        <div style={notificationAdmin} key={id}>
                            <span key={id} style={sumStyle}>Supervisor {supervisor} Approved request from {employeeName} of {itemName} amount {count} in {categoryName} category, description {description} date {date} </span>
                            {/* <span key={index} style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName} Amount: {count} Description: {description} Date: {date}</span> */}
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
