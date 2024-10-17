import { Link } from 'react-router-dom';
import { React, useState, useEffect, useReducer } from 'react';
import NavbarAdmin from './navbarAdmin';
import AddItem from '../images/addItem.svg'
// import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import Modal from 'react-modal';
import Logo from '../images/logo.svg';
import FadeLoader from "react-spinners/FadeLoader";
import { io } from 'socket.io-client';
import SyncLoader from "react-spinners/SyncLoader";
import axios from 'axios';
import Keys from '../keys';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, getStorage, listAll } from "firebase/storage";
import DataTable from 'react-data-table-component';
import Delivery from './deliveryFront';

function Company() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    const socket = io.connect(`${ioPort}`);

    const Container = {
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'auto',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // fontFamily: "'Arial', sans-serif",
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

    const Selects = {
        width: '43%',
        height: '18%',
        color: 'black',
        border: 'none',
        borderRadius: '21px'
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

    const modal3 = {
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
            fontFamily: 'Arial, sans-serif',
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

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '25%',
            marginLeft: '495px',
            height: '76vh',
            backgroundColor: 'rgb(94, 120, 138)',
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
    };

    const report = {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    }

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
    const [infoCompany, setInfoCompany] = useState([]);
    const [companyImages, setCompanyImages] = useState({});
    const [bringAll, setBringAll] = useState([]);
    const [companyModalOpen, isCompanyModalOpen] = useState(false);
    const [oneCompanyID, setOneCompanyID] = useState('');
    const [isDeliveryNoteOpen, setIsDeliveryNoteOpen] = useState(false);
    const [oneCompany, setOneCompany] = useState([]);
    const [imageForOneCompany, setImageForOneCompany] = useState('');
    const [category, setCategory] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [tab, setTab] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [item, setItem] = useState([]);
    const [supervisor, setSupervisor] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemName, setItemName] = useState('');
    const [CompanyName, setCompanyName] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('')
    const [pdf, setPDF] = useState('');
    const [IDForDeliveryUseEffect, setIDForDeliveryUseEffect] = useState('')
    const [quantity, setQuantity] = useState();
    const [totalIn, setTotalIn] = useState([]);
    const [isIssueLoaderOpen, setIssueLoaderOpen] = useState(false)


    const openIssueLoader = (ID) => {
        setIssueLoaderOpen(true);
        handleIssue(ID);
    }

    const closeIssueLoader = () => {
        setIssueLoaderOpen(false);
    }


    const openDeliveryNote = (ID) => {
        setIsDeliveryNoteOpen(true);
        handleDeliveryNoteForOneCompany(ID);
        setIDForDeliveryUseEffect(ID);
    };

    const closeDeliveryNoteModal = () => {
        setIsDeliveryNoteOpen(false);
    };

    const openCompanyModal = (ID) => {
        isCompanyModalOpen(true);
        setOneCompanyID(ID);
        fetchOneCompany(ID);

    };

    const closeCompanyModal = () => {
        setImageForOneCompany('')
        setData('');
        setOneCompanyID('');
        setItemName('');
        setDate('');
        setAmount('');
        setPDF('');
        isCompanyModalOpen(false);
    };





    const fetchOneCompany = async (ID) => {

        const imageRef = ref(storage, `companyLogos/${ID}`);
        const imageURL = await getDownloadURL(imageRef);
        setImageForOneCompany(imageURL);

        try {
            const responsee = await axios.get(`${url}/gets-one/${ID}`);
            setData(responsee.data);
            console.log("Hittttttttttt");
        } catch (error) {
            // console.error("Error", error);
        };

        try {
            const response = await axios.get(`${url}/get-one-company/${ID}`);

            setOneCompany(response.data);
        } catch (error) {
            console.error("Error: ", error)
        };
    };

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


    useEffect(() => {
        const fetch = async () => {
            try {
                const storage = getStorage();
                const listRef = ref(storage, 'companyLogos/');
                const res = await listAll(listRef);
                // console.log("Files fetched: ", res.items);
                const names = res.items.map((itemRef) => itemRef.name);
                // console.log("File names: ", names);

                setBringAll(names);
            } catch (error) {
                console.error("Error: ", error);
            };
        }
        fetch();
    }, []);
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${url}/get-company`);
                setInfoCompany(response.data);

                // Fetch images for each company
                const storage = getStorage();
                const imageFetches = response.data.map(async (company) => {
                    const imageRef = ref(storage, `companyLogos/${company.id}`);
                    try {
                        const imageURL = await getDownloadURL(imageRef);
                        return { [company.id]: imageURL };
                    } catch (error) {
                        console.error(`Error fetching image for company ${company.id}: `, error);
                        return { [company.id]: console.log("No Image") };
                    }
                });

                const images = await Promise.all(imageFetches);
                const imagesMap = Object.assign({}, ...images);
                setCompanyImages(imagesMap);
            } catch (error) {
                console.error("Error: ", error);
            }
        };
        fetchCompanies();
    }, [url]);

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


    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
    };




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


    const handleItemChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedItem(selectedValue);
    };


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


    const handleSupervisorChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedSupervisor(selectedValue);
    };


    const handleQuantity = (event) => {
        setQuantity(event.target.value)
    };


    useEffect(() => {
        const bring = async () => {
            try {
                const response = await axios.get(`${url}/get-total-in/${selectedItem}`);
                setTotalIn(response.data);
            } catch (error) {
                // console.error("Error: ", error);
            }
        };
        bring();
    }, [selectedItem]);


    const handleIssue = async (ID) => {

        try {

            console.log("Numbers: ", totalIn.totalIn, quantity)

            if (totalIn.totalIn >= quantity) {

                const response = await axios.get(`${url}/get-one-company-for-delivery/${oneCompanyID}/${ID}`);

                const data = (response.data);
                console.log("Data: ", data)


                const date = new Date();
                const messageDatas = {
                    itemID: selectedItem,
                    company: oneCompanyID,
                    requestor: selectedSupervisor,
                    date: date,
                    amount: quantity,
                };

                console.log("Passed: ", messageDatas);

                // socket.emit("Go For Delivery", messageDatas);

                // const post = await axios.post(`${url}/post-some`, messageDatas);

                socket.emit("Company Insert", (messageDatas));

                const responsee = await axios.put(`${url}/change-status-from-notifications-for-bulkx`, messageDatas);
                console.log("Response: ", responsee.data);

                setInterval(() => {
                    setIssueLoaderOpen(false);
                }, 2700);

            } else {
                window.alert("Insufficient Amount...");
            }
        } catch (error) {
            console.error("Error: ", error);
        };
    };



    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const column = [
        {
            name: 'Item',
            selector: row => row.name
        },
        {
            name: 'Issuer',
            selector: row => row.username
        },
        {
            name: 'Date',
            selector: row => formatDate(row.date)
        },
        {
            name: 'Amount',
            selector: row => row.amount
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Delivery Note',
            selector: row => (
                <button onClick={() => openDeliveryNote(row.id)}>View</button>
                // <button onClick={createPdf}>View</button>
            )
        }
    ];

    const handleDeliveryNoteForOneCompany = async (IDForDeliveryUseEffect) => {
        try {
            const response = await axios.get(`${url}/get-one-company-for-delivery/${oneCompanyID}/${IDForDeliveryUseEffect}`);

            const data = (response.data);

            console.log("Data: ", data)
            setItemName(data[0].name);
            setCompanyName(data[0].CompanyName);
            const date = formatDate(data[0].date);
            setDate(date);
            setAmount(data[0].amount);

            // const messageDatas = {
            const itemName = itemName;
            const CompanyName = CompanyName;
            const amount = amount;
            // };

            const ren = Delivery(CompanyName, itemName, amount, date);
            console.log("Renner: ", ren);
            // socket.emit("Go For Delivery", messageDatas);

        } catch (error) {
            console.error("Error: ", error);
        };
    };

    useEffect(() => {
        if (itemName && CompanyName && date && amount) {
            const messageData = {
                itemName: itemName,
                CompanyName: CompanyName,
                date: date,
                amount: amount,
            };

        }
    }, [itemName, CompanyName, date, amount, pdf]);

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                const response = await axios.get(`${url}/get-pdf`, {
                    responseType: 'blob'
                });
                const pdfBlob = response.data;
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPDF(pdfUrl);
                console.log("Response: ", pdfUrl);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        fetchPDF();
    }, [url]);

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
                        <button key={company.id} style={CompanyButton} onClick={() => openCompanyModal(company.id, company.CompanyName)}>
                            {companyImages && companyImages[company.id] ? (
                                <img
                                    src={companyImages[company.id]}
                                    alt={`${company.CompanyName} logo`}
                                    style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            ) : (
                                <FadeLoader color={'blue'} loading={loading} size={11} />
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>{company.CompanyName}</p>
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
                            <div>

                                {oneCompany.map(one => (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <p>Name:{one.CompanyName}</p>
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
                    </div>
                    }


                    {tab === 1 && <div style={issue}>
                        <div style={{ width: '20%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '40%', height: '60%', display: 'flex', justifyContent: 'center', marginTop: '60px', gap: '12px', alignItems: 'center', flexDirection: 'column' }}>
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

                            <input type='text' style={{ width: '45%', color: 'black', backgroundColor: 'white' }} placeholder='Quantity' name='quantity' onChange={handleQuantity} />

                            <select onChange={handleSupervisorChange} value={selectedSupervisor} style={Selects}>
                                <option value='' disabled>Select Issuer</option>
                                {supervisor.map(supers => (
                                    <option key={supers.id} value={supers.id} style={Option} >{supers.username}</option>
                                ))}
                            </select>

                            <button style={{ backgroundColor: 'white', width: '20%' }} onClick={() => openIssueLoader(oneCompanyID)}>Issue Out</button>
                            {/* <button style={{ backgroundColor: 'white', width: '20%' }} onClick={() => openDeliveryNote()}>Issue Out</button> */}

                        </div>

                    </div>
                    }

                    {tab === 2 && <div style={report} >
                        <div style={{ width: '20%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '80%', backgroundColor: 'rgb(163, 187, 197)', height: '80%', display: 'flex', borderRadius: '26px', justifyContent: 'center', alignItems: 'center', marginTop: '42px', marginLeft: '109px', flexDirection: 'column' }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                <DataTable
                                    columns={column}
                                    data={data}
                                    pagination
                                ></DataTable>
                            </div>
                        </div>

                    </div>
                    }

                    <div>
                        <Modal isOpen={isDeliveryNoteOpen} onRequestClose={closeDeliveryNoteModal} style={modal3}>
                            <>
                                <Delivery />
                            </>
                        </Modal>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isIssueLoaderOpen} onRequestClose={closeIssueLoader} className={modal} >
                <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                    <SyncLoader color={'green'} loading={loading} size={19} />
                    <div style={{ fontFamily: 'sans-serif' }}>
                        <br />
                        <p>Please Wait...</p>
                    </div>
                </div>
            </Modal>

        </div>
    );
};
export default Company;