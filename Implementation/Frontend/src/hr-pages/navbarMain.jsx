import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'

function NavbarMain() {
    const color = {
        color: 'green'
    }
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
                if (EmpID) {
                    const response = await axios.get(`http://localhost:5500/employee/${EmpID}`);
                    setData(response.data[0]);
                    // console.log("Data", response.data[0]);
                } else {
                    console.error("EmpID Not found in localStorage")
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="navbar">
            <ul className='ulhr' style={color}>
                <li className='li1supervisor'><Link to={'/home-hr'}>Home</Link></li>
                <li className='li1supervisor'><Link to={'/notification-hr'}>View Requests</Link></li>
                <li className='li1supervisor' onClick={handleLogout}><Link>Log Out</Link></li>
            </ul>
            <ul className='ul2hr'>
                <li className='lisupervisor'><Link to={'/account-hr'} onMouseOver={openModal}>Account</Link></li>
                <li className='lisupervisor'><Link to={'/request-hr'}>Request</Link></li>
                <li className='lisupervisor'><Link to={'/transaction-hr'}>Transactions</Link></li>
                <li className='lisupervisor'><Link to={'/terms-hr'}>Terms & Conditions</Link></li>
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

export default NavbarMain;
