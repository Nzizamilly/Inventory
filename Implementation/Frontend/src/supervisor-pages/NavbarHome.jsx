import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Centrika from '../images/centrika-removebg.png';
import axios from 'axios';
import Modal from 'react-modal'

function NavbarHome() {
    const color = {
        color: 'green'
    }
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('');

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

    const handleTransactionChange = (event) => {
        const selectedTransactionType = event.target.value;
        setTransactionType(event.target.value);

        if (selectedTransactionType === "item") {
            navigate('/notification-supervisor')
        } else {
            navigate('/purchase-supervisor')
        }
    };
   
    const select = {
        width: '209px',
        color: 'white',
        display: 'block',
        padding: '8px 16px',
        borderRadius: '12px',
        color: 'white',
        marginTop: '7px',
        textDecoration: 'none',
        backgroundColor: 'black',
        float: 'right',
        justifyContent: 'center'

    }

    return (
        <div className="navbar">
            <ul className='ul1' style={color}>
            <li style={{ float: 'left', marginTop: '-1px', marginLeft: '174px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
                {/* <li className='li1supervisor'><Link to={'/notification-supervisor'}>View Requests</Link></li> */}
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Requests</option>
                    <option value="item" >Item</option>
                    <option value="purchase" >Purchase</option>
                </select>
                <li className='li1'><Link to={'/home-supervisor'}>Home</Link></li>
            </ul>
            <ul className='ul2supervisor'>
                <li className='lisupervisor'><Link to={'/account-admin'} onMouseOver={openModal}>Account</Link></li>
                <li className='lisupervisor'><Link to={'/request-supervisor'}>Request</Link></li>
                <li className='lisupervisor'><Link to={'/transactions-supervisor'}>Transactions</Link></li>
                <li className='lisupervisor'><Link to={'/terms-supervisor'}>Terms & Conditions</Link></li>
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

export default NavbarHome;
