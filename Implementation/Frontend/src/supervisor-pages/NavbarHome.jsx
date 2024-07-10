import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Centrika from '../images/centrika-removebg.png';
import AccountIcon from '../images/accountSVG.svg';
import PolicySVG from '../images/policySVG.svg';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import Keys from '../keys';

function NavbarHome() {

    const url = Keys.REACT_APP_BACKEND;

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

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
    const color = {
        color: 'green'
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
                    const response = await axios.get(`${url}/employee/${EmpID}`);
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
    };

    const option = [
        { value: 'item', label: "Item Request" },
        { value: 'purchase', label: "Purchase Request" },
    ];

    const options = [
        { value: 'item', label: "Item Notification" },
        { value: 'purchase', label: "Purchase Notification" },
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
    };

    const handleRequestChange = (event) => {
        setSelectedRequest(event.value);
    };

    const handleNotificationChange = (event) => {
        setSelectedNotification(event.value);
    };

    useEffect(() => {
        const changeNotifications = (selectedNotification) => {
            if (selectedNotification === 'item') {
                navigate('/purchase-review-supervisor');
            } else if (selectedNotification === 'purchase') {
                navigate('/purchase-notifications-supervisor');
            };
        };
        changeNotifications(selectedNotification);
    }, [selectedNotification])


    useEffect(() => {
        const changeRequest = (selectedRequest) => {
            if (selectedRequest === 'item') {
                navigate('/request-supervisor');
            } else if (selectedRequest === 'purchase') {
                navigate('/purchase-request-supervisor');
            };
        };
        changeRequest(selectedRequest);
    }, [selectedRequest])


    return (
        <div className="navbar">
            <ul className='ul1' style={color}>
                <li style={{ float: 'left', marginTop: '-1px', marginLeft: '174px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li style = {{ float: 'right',  width: '99px', height: '82px', color: 'white', backgroundColor: 'rgb(8, 81, 26)',  justifyContent: 'center'}} onClick={handleLogout}><Link>Log Out</Link></li>
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Requests</option>
                    <option value="item" >Item</option>
                    <option value="purchase" >Purchase</option>
                </select>
                <li style = {{ float: 'right',  width: '99px', height: '82px', color: 'white', backgroundColor: 'rgb(8, 81, 26)',  justifyContent: 'center'  }}><Link to={'/home-supervisor'}>Home</Link></li>
            </ul>
            <ul className='ul2supervisor'>
                <li className='liAdmin'><Link to={'/account-admin'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li>
                <Select
                    options={option}
                    styles={customStyles}
                    placeholder="Request Forms"
                    onChange={handleRequestChange}
                />
                {/* <li className='lisupervisor'><Link to={'/purchase-review-supervisor'}>Notifications</Link></li> */}
                <Select
                    options={options}
                    styles={customStyles}
                    placeholder="Notifications"
                    onChange={handleNotificationChange}
                />
                {/* <li className='lisupervisor'><Link to={'/transactions-supervisor'}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Transactions</p></Link></li> */}
                <li className='liAdmin'><Link to={'/terms-supervisor'}><img src={PolicySVG} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Terms and Conditions</p></Link></li>
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