import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarMain from './navbarMain.jsx';
import DataTable from 'react-data-table-component';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';

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
        socket.emit("change-status-approve", notifications );
        try {
            console.log("Notifications to be passed: ", notifications);

            const putResponse = await axios.post('http://localhost:5500/post-by-hr', notifications);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleDeny = async (index, notification) => {
        socket.emit("Denied_By_Either(1)", notification);
        socket.emit("change-status-deny", notification);
        socket.emit("change-status-deny-for-employee", notification);
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
    }, []);

    const div = {
        width: '86%',
        marginLeft: '14%'
    };

    const smaller = {
        display: 'flex',
        flexDirection: 'inline',
    };

    const buttons = {
        width: '65px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '1px',
        backgroundColor: 'white'
    };

    const handlePending = async () => {
        console.log("HandlePending is Hit");
        const response = await axios.get("http://localhost:5500/get-pending-notifications");
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result);
    };

    const handleApprovedRequest = async () => {
        console.log("HandleApproved is Hit");
        const response = await axios.get("http://localhost:5500/get-approved-notifications");
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result)
    }
    const handleDenyRequest = async () => {
        console.log("HandleDenied is Hit");
        const response = await axios.get("http://localhost:5500/get-denied-notifications");
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result)
    };

    const column = [
        {
            name: 'Employee',
            selector: row => row.employee_username
        },
        {
            name: 'Approved Supervisor ',
            selector: row => row.supervisor_username
        },
        {
            name: 'Item Requested',
            selector: row => row.name
        },
        {
            name: 'Category ',
            selector: row => row.category_name
        },
        {
            name: 'Request Description',
            selector: row => row.description
        },
        {
            name: 'Date of Request',
            selector: row => row.date_approved
        },
        {
            name: 'Amount Requested',
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

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                {/* {notifications.map((notification) => {
                    console.log("Data in the div", notification);
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
                })} */}

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
export default NotificationHR;
