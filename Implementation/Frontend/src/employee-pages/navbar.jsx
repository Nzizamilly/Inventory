import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Centrika from '../images/centrika-removebg.png';
import Select from 'react-select';

function Navbar() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalStyles = {
    content: {
      top: '18%',
      width: '20%',
      left: '20%',
      right: 'auto',
      gap: '12px',
      borderRadius: '12px',
      height: '25%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.9,
      fontFamily: 'Your Custom Font, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      color: 'white',
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)', // Adjust the background color and opacity
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const EmpID = localStorage.getItem("userID");
      try {
        const response = await axios.get(`http://localhost:5500/employee/${EmpID}`);
        setData(response.data[0]);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, [data]);


  const option = [
    { value: 'item', label: "Item Request" },
    { value: 'purchase', label: "Purchase Request" },
  ];

  const options = [
    { value: 'item', label: "Item Notifications" },
    { value: 'purchase', label: "Purchase Notifications" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      // justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'lightgrey',
        color: 'black'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      width: '54px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
    })
  }
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleRequestChange = (event) => {
    setSelectedRequest(event.value);
  };

  const handleNotificationChange = (event) => {
    setSelectedNotification(event.value);
  };

  useEffect(() => {
    const changeRequest = (selectedNotification) => {
      if (selectedNotification === 'item') {
        navigate('/notification-employee');
      } else if (selectedNotification === 'purchase') {
        navigate('/purchase-notification-employee');
      };
    }
    changeRequest(selectedNotification);
  }, [selectedNotification])

  useEffect(() => {
    const changeNotification = (selectedRequest) => {
      if (selectedRequest === 'item') {
        navigate('/request-employee');
      } else if (selectedRequest === 'purchase') {
        navigate('/purchase-request');
      };
    }
    changeNotification(selectedRequest);
  }, [selectedRequest])

  return (
    <div className="navbar">
      <ul className='ul1'>
        <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
        <li className='li1'><Link to={'/home-employee'}>Home</Link></li>
        <li style={{ float: 'left', marginLeft: '193px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
      </ul>
      <ul className='ul2Admin'>
        <li><Link to={'/account-employee'} onMouseOver={openModal}>Account</Link></li>
        <Select
          options={option}
          styles={customStyles}
          placeholder="Request"
          onChange={handleRequestChange}
        />
        <Select
          options={options}
          styles={customStyles}
          placeholder="Notifications"
          onChange={handleNotificationChange}
        />
        <li><Link to={'/terms-employee'}>Terms and Conditions</Link></li>
      </ul>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
        {data && (
          <>
            <p>Username: {data.username}</p>
            <p>Password: {data.password}</p>
            <p>Position: {data.role_name}</p>
            <p>Department: {data.department_name}</p>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Navbar;
