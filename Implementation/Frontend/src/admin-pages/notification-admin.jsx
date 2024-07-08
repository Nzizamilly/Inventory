import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import io from 'socket.io-client';
import axios from 'axios';
import Modal from 'react-modal';
import RiseLoader from "react-spinners/RiseLoader";
import DataTable from 'react-data-table-component';
import Keys from '../keys';

function NotificationAdmin() {

  const ioPort = Keys.REACT_APP_SOCKET_PORT;
  const url = Keys.REACT_APP_BACKEND;

  const socket = io.connect(`${ioPort}`);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGivingOutModalOpen, setIsGivingOutModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  const openGvingOutModal = (row) => {
    setIsGivingOutModalOpen(true);
    handleSerialStatus(row);
  };

  const closeGivingOutModal = () => {
    setIsGivingOutModalOpen(false);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${url}/get-hr-admin-pending-requests`);
        setNotifications(response.data)
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    fetch();

  }, [])

  const column = [
    {
      name: 'Item',
      selector: row => row.name
    },
    {
      name: 'Requestor',
      selector: row => row.employee_username
    },
    {
      name: 'Supervisor',
      selector: row => row.supervisor_username
    },
    {
      name: 'Category',
      selector: row => row.category_name
    }, {
      name: 'Quantity Requested',
      selector: row => row.amount
    }, {
      name: 'Description',
      selector: row => row.description
    },
    {
      name: 'Date Approved',
      selector: row => row.date_approved
    },
    {
      name: 'Issue Out',
      cell: row => (
        <button style={{ width: '59%', backgroundColor: 'green', color: 'white' }} onClick={() => openGvingOutModal(row)} >Issue to</button>
      ),
    },
  ];

  const handleSerialStatus = async (row) => {
    const requestor = row.employee_username;
    const item = row.name;
    const amount = row.amount;
    const rowID = row.id;
    setName(requestor);
    setItem(item);
    setAmount(amount);

    try {

      const response = await axios.put(`${url}/change-status-from-notifications/${requestor}/${item}/${amount}/${rowID}`);
      const result = response.data;

      if (result === "Given Out") {

        socket.emit("Send Approved Email", row);

        const responsee = await axios.put(`${url}/change-request-stockStatus/${rowID}`);
        console.log("Responsee: ", responsee.data);

      } else {
        window.alert("Insuffiencient Amount To Give Out");
      }

      setInterval(() => {
        setIsGivingOutModalOpen(false);
      }, 2700);

    } catch (error) {
      console.error("Error: ", error);
    };
  };

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  const smaller = {
    display: 'flex',
    flexDirection: 'inline',
    gap: '2px'
  }
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
    const response = await axios.get(`${url}/get-hr-admin-pending-requests`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result);
  };

  const handleApprovedRequest = async () => {
    console.log("HandleApproved is Hit");
    const response = await axios.get(`${url}/get-hr-admin-given-requests`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result);
  };

  return (
    <div> <NavbarAdmin></NavbarAdmin>
      <div className="random-container">
        <div style={{ width: '84%', marginLeft: '193px' }}>
          <h1 style={{ color: 'white' }}>Notifications</h1>
          <div style={smaller}>
            <button style={buttons} onClick={handlePending}>Pending</button>
            <button style={buttons} onClick={handleApprovedRequest}>Issued</button>
          </div>

          <div style={{ width: '100%' }}>
            <DataTable
              data={notifications}
              columns={column}
              pagination
            ></DataTable>
          </div>

          <Modal isOpen={isGivingOutModalOpen} onRequestClose={closeGivingOutModal} style={modal} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <RiseLoader color={'#3444e5'} loading={loading} size={11} />
              <div style={{ fontFamily: 'sans-serif' }}>
                <br />
                <p>Issuing {amount} {item} to {name}</p>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
}
export default NotificationAdmin;
