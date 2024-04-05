import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import io from 'socket.io-client';
import axios from 'axios';
import DataTable from 'react-data-table-component'

function NotificationAdmin() {
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
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    fetch();

  }, [])

  const sumStyle = {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 12px',
  };

  const column = [
    {
      name: 'Requestor',
      selector: row => row.employee_username
    },
    {
      name: 'Supervisor',
      selector: row => row.supervisor_username
    }, {
      name: 'Item',
      selector: row => row.name
    }, {
      name: 'Category',
      selector: row => row.category_name
    }, {
      name: 'Amount',
      selector: row => row.amount
    }, {
      name: 'description',
      selector: row => row.description
    },
    {
      name: 'Date Approved',
      selector: row => row.date_approved
    },
  ]


  return (
    <div> <NavbarAdmin></NavbarAdmin>
      <div className="random-container">
        <div style={{width: '74%', marginLeft: '53px'}}>
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
export default NotificationAdmin;