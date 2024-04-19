import React, { useEffect, useState } from 'react';
import NavbarHome from './NavbarHome';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Red from '../images/red-circle.svg';
import FadeLoader from "react-spinners/FadeLoader";
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import View from '../images/info.svg';
import Modal from 'react-modal';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import { io } from 'socket.io-client';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "../firebase";

function PurchaseSupervisor() {

    const [viewQuotation, setViewQuotation] = useState(false);
    const [allRequests, setAllRequests] = useState([]);
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoading(prevLoading => !prevLoading);
        }, 20000);
        return () => clearInterval(intervalId);
    }, []);

    const handleViewQuotation = (ID) => {
        setViewQuotation(true);
        fetchImageURL(ID);
        setImageURL(ID);
    }

    const closeModal = () => {
        setViewQuotation(false);
    }

    const socket = io.connect("http://localhost:5001");

    socket.on("connect", () => {
        console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from the server");
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const supervisorID = localStorage.getItem("userID");
                const response = await axios.get(`http://localhost:5500/get-purchase-notification/${supervisorID}`);
                const result = response.data;
                console.log("Quotation: ", typeof result[0].quotation);
                setAllRequests(result);
                console.log("DATAS: ", result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const fetchImageURL = async (ID) => {
        try {
            if (ID) {
                console.log("ID PROVIDED: ", ID)
                const imageRef = ref(storage, `images/${ID}`);
                const imageURL = await getDownloadURL(imageRef);
                setImageURL(imageURL);
            };
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    console.log("Fetched Image Type: ", imageURL);

    const svgStyle = {
        width: '27px',
        height: '27px',
        borderRadius: '14px',
    };

    const div = {
        width: '90%',
        marginLeft: '13%',
    }

    const smaller = {
        display: 'flex',
        flexDirection: 'inline',
    }

    const buttons = {
        width: '65px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '1px',
        backgroundColor: 'white'
    };

    const column = [
        {
            name: 'Requestor',
            selector: row => row.username
        },
        {
            name: 'Item Requested',
            selector: row => row.expenditure_line
        },
        {
            name: 'End Goal',
            selector: row => row.end_goal
        },
        {
            name: 'Amount',
            selector: row => row.amount
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Status',
            selector: row => row.status
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
            name: 'View Quotation',
            cell: row => (
                <button className='buttonStyle3' onClick={() => handleViewQuotation(row.id)}><img src={View} style={svgStyle} alt="Deny" /></button>
            )
        },
        {
            name: 'Approve',
            cell: row => (
                <button className='buttonStyle3' onClick={() => handleApprove(row)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
            )
        },
       
        // {
        //     name: 'View Quotation',
        //     cell: row => (
        //         <button className='buttonStyle3' onClick={() => handleViewQuotation(row.quotation)}><img src={View} style={svgStyle} alt="Deny" /></button>
        //     )
        // },
        {
            name: 'Deny',
            cell: row => (
                <button className='buttonStyle3' onClick={() => handleDeny(row.id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
            )
        }
    ]

    const handleApprove = async (notifications) => {
        console.log("Notification: ", notifications.quotation);
        const id = notifications.id

        const response = await axios.put(`http://localhost:5500/change-status/${id}`);
        console.log("Response Data: ", response.data);
     
        try {

            const id = notifications.id;
            const imageRef = ref(storage, `images/${id}`);
            const imageURL = await getDownloadURL(imageRef);

            const response = await fetch(imageURL);
            const blob = await response.blob();
            
           const HrImageRef = ref(storage, `images-for-hr/${notifications.id}`);
           await uploadBytes(HrImageRef, blob)

            const supervisorID = localStorage.getItem("userID");
            await axios.post(`http://localhost:5500/add-purchase-supervisor-hr/${supervisorID}`, notifications);
        } catch (error) {
            console.error('Error', error);
        }
        window.alert("Request Sent to HR for Second-tier Approval");
    };

    const handleDeny = async (index) => {
        console.log("Notifications id :", index);
        window.alert("Request Denied Successfully");
        try {
            await axios.put(`http://localhost:5500/deny-by-supervisor-purchase/${index}`);
            console.log("Denied for ID", index);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handlePending = async () => {
        console.log("HandlePending is Hit");
        const supervisorID = localStorage.getItem("userID");
        const response = await axios.get(`http://localhost:5500/get-purchase-notification/${supervisorID}`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllRequests(result);
    };

    const handleApprovedRequest = async () => {
        console.log("HandleApproved is Hit");
        const supervisorID = localStorage.getItem('userID');
        const response = await axios.get(`http://localhost:5500/get-approved-purchase-notification/${supervisorID}`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllRequests(result)
    }

    const handleDenyRequest = async () => {
        console.log("HandleDenied is Hit");
        const supervisorID = localStorage.getItem('userID');
        const response = await axios.get(`http://localhost:5500/get-denied-notification-purchase-supervisor/${supervisorID}`);
        const result = response.data;
        console.log("DATA For Denied: ", result);
        setAllRequests(result);
    };

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '80%',
            maxWidth: '800px',
            height: 'auto',
            border: 'none',
            marginLeft: '295px',
            overflow: 'auto',
            borderRadius: '12px',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
        },
    };


    return (
        <div>
            <NavbarHome></NavbarHome>
            <div className="notification-supervisor">
                <div style={div}>
                    <h1 style={{ color: 'white' }}>Purchase Notifications</h1>
                    <div style={smaller}>
                        <button style={buttons} onClick={handlePending}>Pending</button>
                        <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
                        <button style={buttons} onClick={handleDenyRequest} >Denied</button>
                    </div>
                    <DataTable
                        data={allRequests}
                        columns={column}
                        pagination
                    ></DataTable>
                    <Modal isOpen={viewQuotation} onRequestClose={closeModal} style={modal}>
                        <div style={{ width: "100%", height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {imageURL ? (
                                <img src={imageURL} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                            ) : (
                                <div className="NoPage">
                                    <FadeLoader color={'#D0031B'} loading={loading} size={200} />
                                </div>
                            )}
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default PurchaseSupervisor;
