import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';
import DataTable from 'react-data-table-component';

function Notification() {
  const [notifications, setNotifications] = useState([]);

  // const socket = io.connect("http://localhost:5001");

  // socket.on("connect", () => {
  //   console.log("Connected to the server");

  //   socket.on("Approved_By_Either(2)", (MessageData) => {
  //     console.log("Approved Info", MessageData);
  //     setNotifications(MessageData);
  //     const approve = "Approved";
  //     setStatus(status);
  //   });

  //   socket.on("Denied_By_Either(2)", (MessageData, status) => {
  //     console.log("Denied Info", MessageData, status);
  //     setNotifications(MessageData);
  //     const deny = "Denied";
  //     setStatus(deny);
  //   });
  // });

  // socket.on("disconnect", () => {
  //   console.log("Disconnected from socket server");
  // });


  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('userID');
      const response = await axios.get(`http://localhost:5500/get-all-requests/${id}`);
      setNotifications(response.data)
    }
    fetchData();
  }, [notifications])

  console.log("Notifications: ", notifications);


  const column = [
    {
      name: 'Item Requested',
      selector: row => row.name
    },
    {
      name: 'Category',
      selector: row => row.category_name
    },
    {
      name: 'Date',
      selector: row => row.date_of_request
    },
    {
      name: 'Supervisor Assigned',
      selector: row => row.username
    },
    {
      name: 'Follow Up',
      selector: row => row.status
    }
  ]


  return (
    <div>
      <Navbar></Navbar>
      <div className="notification-container">
        <div style={{width: '64%'}}>
        <DataTable
          data={notifications}
          columns={column}
          pagination
        >
        </DataTable>
        </div>

      </div>
    </div>
  );
}

export default Notification;