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
    width: '52%',
    height: '11%',
    // textAlign: 'center',
    gap: '6px',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: ' row',
    marginLeft: '295px',
    borderRadius: '15px',
    // padding: '7px',
    color: 'black',
    backgroundColor: 'white'
  }

  const handleApprove = async (notifications, index) => {
    try {
      console.log("Notifications id :", index);
      const supervisorID = localStorage.getItem("userID");

      const supervisorName = localStorage.getItem("username");

      socket.emit("Supervisor_Message_HR(1)", notifications, supervisorName);

      await axios.post(`http://localhost:5500/add-request-supervisor-hr/${supervisorID}`, notifications);
      window.alert("Request Sent to HR for Second-tier Approval");

      // await axios.put(`http://localhost:5500/approve-by-supervisor/${index}`)

    } catch (error) {
      console.error('Error', error);
    }
  }

  const handleDeny = async (index, notification) => {
    console.log("Notifications id :", index);
    const status = 'Denied';
    socket.emit("Denied_By_Either(1)", notification);
    try {
      const updatedNotifications = notifications.filter((_, i) => i !== index);
      setNotifications(updatedNotifications);
      await axios.put(`http://localhost:5500/deny-by-supervisor/${index}`);
      console.log("Denied for ID", index);
    } catch (error) {
      console.log('Error', error);
    }
  }

  // useEffect(()=>{

  //     socket.emit("get-some");
  //     socket.on("give-some", (messageData) => {
  //       // if (messageData.status !== 'Denied') {
  //         setNotifications((prevNotifications) => [...prevNotifications, messageData]);
  //       // }
  //     });


  // }, [notifications])


  useEffect(() => {
    const fetch = async () => {
        const response = await axios.get("http://localhost:5500/get-notification");
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result);
    };
    fetch();
}, [notifications])

  // useEffect(() => {
  //   const handleNotification = (messageData) => {
  //     setNotifications((prevNotifications) => [...prevNotifications, ...messageData]);
  //   };

  //   socket.on("Employee_Message_Supervisor(2)", handleNotification);

  //   return () => {
  //     // Cleanup the event listener when the component unmounts
  //     socket.off("Employee_Message_Supervisor(2)", handleNotification);
  //   };
  // }, [ setNotifications]);

  console.log("type in Upper logger", typeof notifications);

  return (

    <div>
      <NavbarHome></NavbarHome>
      <div className="notification-supervisor">
        {notifications.map((notification, index) => {
          console.log("type: ", typeof notification);

          const employeeName = notification.username;
          const itemName = notification.name;
          const categoryName = notification.category_name;
          const description = notification.description;
          const date = notification.date_of_request;
          const count = notification.amount;
          const id = notification.id
          const uniqueKey = `${id}_${index}`;
          // const employeeName = notification.username;

          // const itemName = notification.name;
          // const categoryName = notification.category_name;
          // const description = notification.description;
          // const date = notification.date_of_request;
          // const count = notification.amount;
          // const id = notification.id;
          return (
            <div style={notificationAdmin} key={id}>
              <span style={sumStyle}> {employeeName} Requested: {itemName}  From: {categoryName}  Amount: {count}  Description: {description} Date: {date} </span>
              <button className='buttonStyle3' onClick={() => handleApprove(notification, id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
              <button className='buttonStyle3' onClick={() => handleDeny(id, notification)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
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