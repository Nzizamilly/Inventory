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
        borderRadius: '12px',
        width: '65px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '1px',
        backgroundColor: 'rgb(163, 187, 197)'
    };

    const CompanyButton = {
        height: '48%',
        width: '28%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };


    const smaller = {
        width: '20%',
        height: '15%',
        display: 'flex',
        flexDirection: 'inline',
        gap: '9px',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const allDiv = {
        width: '90%',
        height: '97%',
        backgroundColor: 'rgb(163, 187, 197)'
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
            flexDirection: 'column',
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


            closeAddModal();

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
                const sum = response.data;
                const imageRef = ref(storage, `companyLogos/${sum[0].id}`);
                const imageURL = await getDownloadURL(imageRef);
                setImage(imageURL);
            } catch (error) {
                console.error("Error: ", error);
            };
        }
        fetch();
    }, []);

    const [companyModalOpen, isCompanyModalOpen] = useState(false);
    const [oneCompanyID, setOneCompanyID] = useState('');

    const openCompanyModal = (ID) => {
        isCompanyModalOpen(true);
        setOneCompanyID(ID)
        fetchOneCompany(ID)
    };

    const closeCompanyModal = () => {
        isCompanyModalOpen(false);
    };

    const [tab, setTab] = useState(0);

    const info = {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    };

    const issue = {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    }

    const [oneCompany, setOneCompany] = useState([]);
    const [imageForOneCompany, setImageForOneCompany] = useState('');

    const fetchOneCompany = async (ID) => {

        const imageRef = ref(storage, `companyLogos/${ID}`);
        const imageURL = await getDownloadURL(imageRef);
        setImageForOneCompany(imageURL);

        try {
            const response = await axios.get(`${url}/get-one-company/${ID}`);
            setOneCompany(response.data);
        } catch (error) {
            console.error("Error: ", error)
        };
    };

    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${url}/category`);
                setCategory(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchCategory();
    }, []);

    const Selects = {
        width: '43%',
        height: '18%',
        color: 'black',
        border: 'none',
        borderRadius: '21px'
    };

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
    };

    const Option = {
        width: '39%',
        height: '25%',
        display: 'flex',
        gap: '12px',
        color: 'white',
        backgroundColor: 'black',
        border: 'none',
        borderRadius: '14px'
    };

    const [item, setItem] = useState([]);

    useEffect(() => {
        const fetchItem = async (selectedCategory) => {
            try {
                const response = await axios.get(`${url}/items/${selectedCategory}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        if (selectedCategory) {
            fetchItem(selectedCategory);
        };
    }, [selectedCategory]);

    const [ selectedItem , setSelectedItem ] = useState([]);

    const handleItemChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedItem(selectedValue);
    };

    const [ supervisor , setSupervisor ] = useState([]);

    useEffect(() => {
        const fetchSuper = async () => {
            try {
                const response = await axios.get(`${url}/get-supervisor`);
                setSupervisor(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchSuper();
    }, []);

    const [ selectedSupervisor , setSelectedSupervisor ] = useState('');

    const handleSupervisorChange = (event) => {
       const selectedValue = event.target.value;
       setSelectedSupervisor(selectedValue);
    };

    const [ quantity, setQuantity ] = useState('');

    const handleQuantity = (event) => {
        setQuantity((prev) => ({ ...prev, [event.target.name]: event.target.value }));
      };

const handleIssue = async(ID) => {
    try{
        const requestor = selectedSupervisor;
        const item = selectedItem;
        const amount = quantity.quantity;
        const company = ID;

        console.log("DATA: ", requestor, item, amount, company)

        const response = await axios.put(`${url}/change-status-from-notifications-for-company/${requestor}/${item}/${amount}/${company}`);
        console.log("Response: ", response.data);

    }catch(error){
        console.error("Error: ", error);
    }

}

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
                        <button style={CompanyButton} onClick={() => openCompanyModal(company.id)}>
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
                    <button style={buttons} onClick={() => setTab(0)}>Info</button>
                    <button style={buttons} onClick={() => setTab(1)}>Issue</button>
                    <button style={buttons} onClick={() => setTab(2)}>Report</button>
                </div>
                <div style={allDiv}>
                    {tab === 0 && <div style={info}>
                        <div style={{ width: '20%', height: '100%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>

                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh', backgroundColor: 'white' }} />}
                        </div>

                        <div style={{ width: '40%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {oneCompany.map(one => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p>Name:{one.name}</p>
                                    <p>Email:{one.email}</p>
                                    <p>Number:{one.number}</p>
                                    <div style={{ width: '100%', height: '20%', display: 'flex', flexDirection: 'inline', gap: '12px' }}>
                                        <button style={{ borderRadius: '12px', width: '76%', backgroundColor: 'white' }}>Update</button>
                                        <button style={{ borderRadius: '12px', width: '75%', backgroundColor: 'red' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    }


                    {tab === 1 && <div style={issue}>
                        <div style={{ width: '20%', height: '100%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '40%', marginTop: '40px', height: '70%', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', flexDirection: 'column' }}>
                            <select onChange={handleCategoryChange} value={selectedCategory} style={Selects}>
                                <option value='' disabled>Select Category</option>
                                {category.map(categories => (
                                    <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
                                ))}
                            </select>

                            <select onChange={handleItemChange} value={selectedItem} style={Selects}>
                                <option value='' disabled>Select Item</option>
                                {item.map(items => (
                                    <option key={items.id} value={items.id} style={Option} >{items.name}</option>
                                ))}
                            </select>

                            <input type='text' style={{ width: '45%', color: 'black', backgroundColor: 'white' }} placeholder='Quantity'  name='quantity' onChange={handleQuantity} />

                            <select onChange={handleSupervisorChange} value={selectedSupervisor} style={Selects}>
                                <option value='' disabled>Select Issuer</option>
                                {supervisor.map(supers => (
                                    <option key={supers.id} value={supers.id} style={Option} >{supers.username}</option>
                                ))}
                            </select>

                            <button style={{backgroundColor: 'white', width: '20%'}} onClick={() => handleIssue(oneCompanyID)}>Issue Out</button>

                        </div>

                    </div>
                    }

                </div>
            </Modal>

        </div>
    );
};
export default Company;