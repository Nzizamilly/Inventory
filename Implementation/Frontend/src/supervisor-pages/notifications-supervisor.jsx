import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarHome from './NavbarHome';
import DataTable from 'react-data-table-component';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';

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
  };

  const sumStyle = {
    marginTop: '24px',
    marginLeft: '2px'
  }

  const notificationAdmin = {
    width: '52%',
    height: '11%',
    gap: '6px',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: ' row',
    marginLeft: '295px',
    borderRadius: '15px',
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

  useEffect(() => {
    const fetch = async () => {
      try{
        const supervisorID = localStorage.getItem("userID");
        const response = await axios.get(`http://localhost:5500/get-notification/${supervisorID}`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result);
      }catch(error){
        console.error(error);
      }
    };
    fetch();
}, [])

  console.log("type in Upper logger", typeof notifications);

  const column = [
    {
      name : 'Employee',
      selector: row => row.username
    },
    {
      name : 'Item Requested',
      selector: row => row.name
    },
    {
      name : 'Category ',
      selector: row => row.category_name
    },
    {
      name : 'Request Description',
      selector: row => row.description
    },
    {
      name : 'Date of Request',
      selector: row => row.date_of_request
    },
    {
      name : 'Amount Requested',
      selector: row => row.amount
    },
    {
      name: 'Priority',
      selector: row => (
        row.priority === 'green' ? 
          <img src={Green} style={svgStyle} alt="green" /> :
        row.priority === 'red' ? 
          <img src={Red} style={svgStyle} alt="red" /> :
        row.priority === 'cyan' ? 
          <img src={Cyan} style={svgStyle} alt="cyan" /> :
        (console.log("Not green, red, or cyan"), null)
      )
    },
    {
      name: 'Status',
      selector: row => row.status
    },
    {
      name: 'Approve',
      cell: row => (
        <button className='buttonStyle3' onClick={() => handleApprove(row, row.id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
      )
    },
    {
      name: 'Deny',
      cell: row => (
        <button className='buttonStyle3' onClick={() => handleDeny(row.id, row)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
      )
    }
  ];

  const div = {
    width: '90%',
    marginLeft: '13%'
  }
  const buttons = {
    width: '65px',
    color: 'black',
    cursor: 'pointer',
    padding: '12px 0px',
    borderRadius: '1px',
    backgroundColor: 'white'
  };
  const smaller = {
    display: 'flex',
    flexDirection: 'inline',
  }

  const handlePending = async () => {
    console.log("HandlePending is Hit");
    const supervisorID = localStorage.getItem("userID");
      const response = await axios.get(`http://localhost:5500/get-notification/${supervisorID}`);
      const result = response.data;
      console.log("DATA FROM ENDPOINT: ", result);
      setNotifications(result);
  };

  const handleApprovedRequest = async () => {
    console.log("HandleApproved is Hit");
    const response = await axios.get("http://localhost:5500/get-approved-notification");
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result)
  }
  const handleDenyRequest = async () => {
    console.log("HandleDenied is Hit");
    const response = await axios.get("http://localhost:5500/get-denied-notification");
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result)
  }

  return (

    <div>
      <NavbarHome></NavbarHome>
      <div className="notification-supervisor">
        <div style={div}>
          <div style={smaller}>
          <button style={buttons} onClick={handlePending}>Pending</button>
          <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
          <button style={buttons} onClick={handleDenyRequest} >Denied</button>
          </div>
        <DataTable 
        data={notifications}
        columns={column}
        pagination
        ></DataTable>
        </div>

      </div>
    </div>
  );
}
export default NotificationSupervisor;