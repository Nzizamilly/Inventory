import { Link } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import AddItem from '../images/addItem.svg'
import Modal from 'react-modal';
import Logo from '../images/logo.svg';
import axios from 'axios';
import Keys from '../keys';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Company() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    const Container = {
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'auto',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Arial', sans-serif",
        backgroundColor: ' rgb(163, 187, 197)',
    };

    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
        display: 'flex',
        gap: '12px',
        flexDirection: 'inline'
    };

    const buttons = {
        width: '65px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '1px',
        backgroundColor: 'white'
    };

    const CompanyButton = {
        height: '48%',
        width: '28%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };


    const smaller = {
        display: 'flex',
        flexDirection: 'inline',
        gap: '2px'
    }

    useEffect(() => {
        setLogo(Logo);
    }, []);

    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    }

    const openAddModal = () => {
        isAddModalOpen(true);
    };

    const closeAddModal = () => {
        isAddModalOpen(false);
    };

    const kindaStyle = {
        content: {
            width: '50%',
            height: '43%',
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            border: 'none',
            gap: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgb(163, 187, 197)',
            marginLeft: '380px',
            marginTop: '120px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    const companyModal = {
        content: {
            width: '70%',
            height: '73%',
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            border: 'none',
            gap: '12px',
            borderRadius: '12px',
            backgroundColor: 'white',
            marginLeft: '180px',
            marginTop: '20px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    const logoButton = {
        width: '25%',
        gap: '9px',
        height: '98%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'grey',
        backgroundColor: 'white'
    };

    const [AddModalOpen, isAddModalOpen] = useState(false);
    const [logo, setLogo] = useState();
    const [latestId, setLatestID] = useState('');

    // const updateFileName = (event) => {
    //     const selectedFile = event.target.files[0];
    //     setImageUpload(event.target.files[0]);
    //     const fileName = selectedFile ? selectedFile.name : 'No file Chosen';
    //     setFile(fileName);
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       setImageUrl(reader.result);
    //     };
    //     if (selectedFile) {
    //       reader.readAsDataURL(selectedFile)
    //     }
    //   };


    const updateFileName = (event) => {
        const selectedLogo = event.target.files[0];
        setLogo(selectedLogo);
    };

    const [company, setCompany] = useState({
        name: '',
        number: '',
        email: '',
    });

    const handleChange = (event) => {
        setCompany((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleMake = async () => {

        if (logo == null) return;
        const IdForQuotation = latestId + 1;
        console.log("ID FOR COMPANY PIC: ", IdForQuotation);
        const imageRef = ref(storage, `companyLogos/${logo.name, IdForQuotation}`);
        uploadBytes(imageRef, logo).then(() => {
        });

        try {
            const response = await axios.post(`${url}/add-company`, company);

        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        const fetchIDs = async () => {
            try {
                const response = await axios.get(`${url}/get-company-id`);
                const latestID = response.data[0].id
                setLatestID(latestID);
            } catch (error) {
                console.log("Error: ", error);
            };
        };
        fetchIDs();
    }, []);

    const [infoCompany, setInfoCompany] = useState([]);
    const [image, setImage] = useState();
    const [infoCompanyID, setInfoCompanyID] = useState();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`${url}/get-company`);
                setInfoCompany(response.data);
                console.log("Data: ", infoCompany[0].id);
                const imageRef = ref(storage, `companyLogos/${infoCompany[0].id}`);
                const imageURL = await getDownloadURL(imageRef);
                setImage(imageURL);
            } catch (error) {
                console.error("Error: ", error);
            };
        }
        fetch();
    }, []);

    const [companyModalOpen, isCompanyModalOpen] = useState(false);

    const openCompanyModal = () => {
        isCompanyModalOpen(true);
    };

    const closeCompanyModal = () => {
        isCompanyModalOpen(false);
    };

    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div style={kain}>
                <h1>Company Tab</h1>
                <button className='addItem-btn' onClick={() => openAddModal()}><img src={AddItem} style={svgStyle} /></button>
            </div>

            <div style={Container}>
                <div className="terms-admin">
                    {infoCompany.map(company => (
                        <button style={CompanyButton} onClick={() => openCompanyModal()}>
                            <img src={image} style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>{company.name}</p>
                                <p>{company.email}</p>
                                <p>{company.number}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Modal isOpen={AddModalOpen} onRequestClose={closeAddModal} style={kindaStyle}>
                <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                <label htmlFor="file" style={logoButton}>
                    {logo ? (
                        <img src={logo} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }} />

                    ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}

                    <strong>Logo</strong>
                </label>

                <div style={{ marginLeft: '50px', width: '40%', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                    <input type='text' placeholder='Company Name' style={{ width: '100%' }} name='name' onChange={handleChange} />
                    <input type='text' placeholder='Company Number' style={{ width: '100%' }} name='number' onChange={handleChange} />
                    <input type='text' placeholder='Company Email' style={{ width: '100%' }} name='email' onChange={handleChange} />
                </div>

                <button style={{ backgroundColor: 'green', height: '20%', width: '15%', marginTop: '11%', color: 'white' }} onClick={() => handleMake()} >Add</button>

            </Modal>

            <Modal isOpen={companyModalOpen} onRequestClose={closeCompanyModal} style={companyModal}>
                <div style={smaller}>
                    <button style={buttons}>Pending</button>
                    <button style={buttons}>Issued</button>
                </div>
            </Modal>

        </div>
    );
};
export default Company;
