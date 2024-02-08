import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarHome from './NavbarHome';
import Modal from 'react-modal'

function NotificationSupervisor() {
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

  const handleApprove = async (notifications, index) => {
    try {
      console.log("Notifications id :", index);
      const supervisorID = localStorage.getItem("userID");

      const supervisorName = localStorage.getItem("username");
      const supervisorNameObj = { supervisorName: supervisorName, }

      socket.emit("Supervisor_Message_HR(1)", notifications, supervisorName);

      await axios.post(`http://localhost:5500/add-request-supervisor-hr/${supervisorID}`, notifications);
      window.alert("Request Sent to HR for Second-tier Approval");

      // await axios.put(`http://localhost:5500/approve-by-supervisor/${index}`)


    } catch (error) {
      console.error('Error', error);
    }
  }

  const handleDeny = async (index) => {
    console.log("Notifications id :", index);
    try {
      const updatedNotifications = notifications.filter((_, i) => i !== index);
      setNotifications(updatedNotifications);
      await axios.put(`http://localhost:5500/deny-by-supervisor/${index}`);
      console.log("Denied for ID", index);
    } catch (error) {
      console.log('Error', error);
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
    socket.on("Employee_Message_Supervisor(2)", (messageData) => {
      setNotifications([...notifications, messageData]);
    });

    // const fetchSum = async() => {
    //   try {
    //     const response = await axios.get('http://localhost:5500/get-request-employee-supervisor');
    //     setNotifications(response.data);

    //   } catch (error) {
    //     console.error("Error", error)
    //   }
    // }
    // fetchSum();

  }, [socket, notifications])

  console.log("BO OR AR", notifications);


  return (

    <div>
      <NavbarHome></NavbarHome>
      <div className="notification-supervisor ">
        {notifications.map((notification) => {
          console.log("ID Per Notification ", notification[0].id);
          const employeeName = notification[0].employeeName;
          const itemName = notification[0].itemName;
          const categoryName = notification[0].categoryName;
          const description = notification[0].description;
          const date = notification[0].date;
          const count = notification[0].count;
          return (
            <div style={notificationAdmin} key={notification[0].id}>
              <span key={notification[0].id} style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName}  Amount: {count}  Description: {description} Date: {date}</span>
              <button className='buttonStyle3' onClick={() => handleApprove(notification, notification[0].id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
              <button className='buttonStyle3' onClick={() => handleDeny(notification[0].id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
            </div>
          )
        })}
        {/* {notifications.map((notification, index) => {
          console.log("Data in the div", notification);
          const itemName = notification.itemName;
          const categoryName = notification.category_name;
          const employeeName = notification.username;
          const description = notification.description;
          const date = notification.date;
          const count = notification.amount;
          return (
            <div style={notificationAdmin} key={index}>
              <span key={index} style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName} Amount: {count} Description: {description} Date: {date}</span>
              <button className='buttonStyle3' onClick={() => handleApprove(notification.id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
              <button className='buttonStyle3' onClick={() => handleDeny(notification.id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
            </div>
          )
        })} */}

      </div>
    </div>
  );
}
export default NotificationSupervisor;
