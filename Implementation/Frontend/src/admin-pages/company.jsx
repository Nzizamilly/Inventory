import { Link } from 'react-router-dom';
import { React, useState, useEffect, useReducer } from 'react';
import NavbarAdmin from './navbarAdmin';
import AddItem from '../images/addItem.svg'
// import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import Modal from 'react-modal';
import Logo from '../images/logo.svg';
import PuffLoader from "react-spinners/PuffLoader";
// import { io } from 'socket.io-client';
import SyncLoader from "react-spinners/SyncLoader";
import axios from 'axios';
import Keys from '../keys';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, getStorage, listAll } from "firebase/storage";
import DataTable from 'react-data-table-component';
import Delivery from './deliveryFront';
import RotateLoader from 'react-spinners/RotateLoader';

function Company() {

    // const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    // const socket = io.connect(`${ioPort}`);

    const Container = {
        width: '100%',
        // height: '100vh',
        display: 'flex',
        // overflow: 'auto',
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
        height: '148px',
        width: '32%',
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
        borderRadius: '12px',
        height: '97%',
        backgroundColor: 'rgb(163, 187, 197)'
    }

    const Selects = {
        width: '100%',
        height: '222px',
        color: 'black',
        border: 'none',
        borderRadius: '21px'
    };

    const Selectx = {
        width: '100%',
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
        window.location.reload();
    };

    const modal3 = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '60%',
            height: '90%',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'black',
            // overflow: 'auto',
        },
    };

    const kindaStyle = {
        content: {
            width: '50%',
            height: '43%',
            display: 'flex',
            fontFamily: 'Arial, sans-serif',
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
            zIndex: '20'
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
        gap: '12px',
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
    const [logo, setLogo] = useState('');
    const [latestId, setLatestID] = useState('');
    const [infoCompany, setInfoCompany] = useState([]);
    const [companyImages, setCompanyImages] = useState({});
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
    const [amount, setAmount] = useState(Number)
    const [pdf, setPDF] = useState('');
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
        handleDeliveryNoteForOneCompany(ID);
    };

    const closeDeliveryNoteModal = () => {
        // setItemName('');
        // setCompanyName('');
        // setDate('');
        // setAmount('');

        setIsDeliveryNoteOpen(false);
        resetDeliveryNoteState();
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

    const handleMakeModal = () => {
        handleMake();
        closeAddModal();
    }

    const handleMake = async () => {

        if (logo == null) return;

        try {
            
            const response = await axios.post(`${url}/add-company`, company);
            
            const IdForQuotation = latestId + 1;
            console.log("ID FOR COMPANY PIC: ", IdForQuotation);
            const imageRef = ref(storage, `companyLogos/${logo.name, IdForQuotation}`);
            uploadBytes(imageRef, logo).then(() => {
            });
            
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


    // useEffect(() => {
    //     const fetch = async () => {
    //         try {
    //             const storage = getStorage();
    //             const listRef = ref(storage, 'companyLogos/');
    //             const res = await listAll(listRef);
    //             // console.log("Files fetched: ", res.items);
    //             const names = res.items.map((itemRef) => itemRef.name);
    //             // console.log("File names: ", names);


    //         } catch (error) {
    //             console.error("Error: ", error);
    //         };
    //     }
    //     fetch();
    // }, []);

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
                // console.error("Error: ", error);
            }
        };

        if (url && infoCompany) {
            fetchCompanies();
        };

    }, [url, infoCompany]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${url}/category`);
                setCategory(response.data);
            } catch (error) {
                // console.error("Error: ", error);
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
                // console.error("Error: ", error);
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

    const [from, setFrom] = useState(Number);
    const [to, setTo] = useState(Number);

    useEffect(() => {
        const bring = async () => {
            try {
                const response = await axios.get(`${url}/get-total-in/${selectedItem}`);
                setTotalIn(response.data);
            } catch (error) {
                // console.error("Error: ", error);
            }
        };

        if (selectedItem) {
            bring();
        }
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

                // socket.emit("Company Insert", (messageDatas));

                await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${quantity}`);

                // console.log("Selected ItemID", selectedItem);

                const remaining = Number(Number(totalIn.totalIn) - Number(quantity));

                console.log("Remaining To be inserted", totalIn.totalIn, quantity, remaining);


                const status = 'Out';
                const retour = 'none'

                await axios.put(`${url}/change-status-from-notifications-for-bulkx`, messageDatas).then(
                    await axios.post(`${url}/take-one-daily-transaction/${selectedItem}/${quantity}/${selectedSupervisor}/${status}/${retour}/${remaining}/${oneCompanyID}`)
                )

                setInterval(() => {
                    setIssueLoaderOpen(false);
                }, 2700);

            } else {
                return window.alert("Insufficient Amount...");
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
            )
        }
    ];

    const [renHtml, setRenHtml] = useState('');
    const [load, setLoad] = useState(false);

    const handleDeliveryNoteForOneCompany = async (IDForDeliveryUseEffect) => {

    };

    const handleThis = (ID) => {
        try {
            setTab(2);
            fetchOneCompany(ID);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const resetDeliveryNoteState = () => {
        setItemName('');
        setCompanyName('');
        setDate('');
        setAmount(0);
        setRenHtml(null);
        setIsDeliveryNoteOpen(false);
        setLoad(false);
        console.log("RESET HIT: ", itemName, CompanyName, date, amount);
    };

    const [firstParts, setFirstParts] = useState([]);

    const [selectedFirstPart, setSelectedFirstPart] = useState('');

    const handleFirstPartChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedFirstPart(selectedValue);
    };


    useEffect(() => {
        const handleSerialHunt = async (selectedItem) => {
            try {
                const response = await axios.get(`${url}/get-all-first-parts/${selectedItem}`);
                console.log('Responsee of first parts: ', response.data)
                setFirstParts(response.data);

            } catch (error) {
                console.error("Error: ", error);
            };
        }

        if (selectedItem) {
            handleSerialHunt(selectedItem);
        };

    }, [selectedItem]);

    const bulkOutFunction = async () => {

        if (from > to) {

            try {
                const numbers = [];
                const wholeWordArray = [];

                for (let i = from; i >= to; i--) {
                    numbers.push(i);
                }

                numbers.forEach((number) => {
                    const take = selectedFirstPart + ' ' + number;
                    wholeWordArray.push(take);
                })

                console.log("WholeWordArray: ", wholeWordArray);

                console.log("Numbers: ", numbers.length);

                const realQuantity = numbers.length;

                await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${realQuantity}`).then(
                    await axios.put(`${url}/take-give-out-bulk/${selectedItem}/${wholeWordArray}/${oneCompanyID}`)
                );

                window.alert("Done!!!");

            } catch (error) {
                console.error("Error: ", error);
            }
        } else {
            window.alert("Not following Input Rules");
        }
    };

    const [serialMatch, setSerialMatch] = useState('');
    const [allMatchingSerials, setAllMatchingSerials] = useState([]);

    useEffect(() => {

        const fetchSerialMatch = async (serialMatch) => {
            try {
                const response = await axios.get(`${url}/get-serial-match/${serialMatch}`);
                console.log("Response: ", response.data)
                setAllMatchingSerials(response.data);
            } catch (error) {
                console.error("Error: ", error)
            }
        }

        if (serialMatch) {
            fetchSerialMatch(serialMatch);
        }

    }, [serialMatch]);

    const handleGiveOutOneSerialChoice = async (serialID) => {
        try {

            const realQuantity = 1;
            const status = 'Out';
            const retour = 'none';
            const c = selectedItem;
            const supervisor = selectedSupervisor
            const remaining = Number(Number(totalIn.totalIn) - Number(1))

            await axios.put(`${url}/give-out-one-serial-by-choice/${serialID}/${oneCompanyID}/${supervisor}`).then(
                await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${realQuantity}`).then(
                    await axios.post(`${url}/take-one-daily-transaction/${c}/${realQuantity}/${supervisor}/${status}/${retour}/${remaining}/${oneCompanyID}`)
                ),
            );

            window.alert("Done");

        } catch (error) {
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
                        <button key={company.id} style={CompanyButton} onClick={() => openCompanyModal(company.id, company.CompanyName)}>
                            {companyImages && companyImages[company.id] ? (
                                <img
                                    src={companyImages[company.id]}
                                    alt={`${company.CompanyName} logo`}
                                    style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            ) : (
                                <PuffLoader color={'white'} loading={loading} size={81} />
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

                    <strong>Insert Logo</strong>
                </label>

                <div style={{ marginLeft: '50px', width: '40%', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                    <input type='text' placeholder='Company Name' style={{ width: '100%' }} name='name' onChange={handleChange} />
                    <input type='text' placeholder='Company Number' style={{ width: '100%' }} name='number' onChange={handleChange} />
                    <input type='text' placeholder='Company Email' style={{ width: '100%' }} name='email' onChange={handleChange} />
                </div>

                <button style={{ backgroundColor: 'green', height: '20%', width: '15%', marginTop: '11%', color: 'white' }} onClick={() => handleMakeModal()} >Add</button>

            </Modal>

            <Modal isOpen={companyModalOpen} onRequestClose={closeCompanyModal} style={companyModal}>
                <div style={smaller}>
                    <button style={buttons} onClick={() => setTab(0)}>Info</button>
                    <button style={buttons} onClick={() => setTab(1)}>Issue</button>
                    <button style={buttons} onClick={() => handleThis(oneCompanyID)}>Report</button>
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

                        <div style={{ width: '30%', height: '60%', gap: '12px', alignItems: 'center', display: 'flex', marginTop: '60px', gap: '12px', flexDirection: 'column' }}>
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

                            <input type='text' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} placeholder='Quantity' name='quantity' onChange={handleQuantity} />

                            <select onChange={handleSupervisorChange} value={selectedSupervisor} style={Selects}>
                                <option value='' disabled>Select Issuer</option>
                                {supervisor.map(supers => (
                                    <option key={supers.id} value={supers.id} style={Option} >{supers.username}</option>
                                ))}
                            </select>

                            <button style={{ backgroundColor: 'white', width: '40%' }} onClick={() => openIssueLoader(oneCompanyID)}>Issue Out</button>
                            {/* <button style={{ backgroundColor: 'white', width: '20%' }} onClick={() => openDeliveryNote()}>Issue Out</button> */}

                        </div>

                        <div style={{ width: '50%', height: '100%', gap: '12px', display: 'flex', marginTop: '60px', flexDirection: 'inline' }} >
                            <div style={{ width: '50%', height: '60%', gap: '9px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                {/* <button>Find Serials</button> */}
                                <select onChange={handleFirstPartChange} value={selectedFirstPart} style={Selectx}>
                                    <option value='' disabled>Select First Part</option>
                                    {firstParts.map((first_part, index) => (
                                        <option key={index} value={first_part} style={Option} >{first_part}</option>
                                    ))}
                                </select>
                                <input type='text' placeholder='From (Bigger)' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} onChange={(e) => setFrom(e.target.value)} />
                                <input type='text' placeholder='To (Smaller)' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} onChange={(e) => setTo(e.target.value)} />
                                <button style={{ backgroundColor: 'white', width: '50%' }} onClick={() => bulkOutFunction()}>Bulk Out</button>
                            </div>
                            <div style={{ width: '50%', height: '60%', display: 'flex', flexDirection: 'column' }} >
                                <input
                                    type="text"
                                    placeholder="Search Serial Number"
                                    style={{ width: '100%', color: 'black', backgroundColor: 'white' }}
                                    onChange={(e) => setSerialMatch(e.target.value)}
                                />
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {allMatchingSerials.map((serial) => (
                                        <button
                                            key={serial.id}
                                            style={{ width: '100%', height: '30%', backgroundColor: 'white', color: 'black' }}
                                            onClick={() => handleGiveOutOneSerialChoice(serial.id)}
                                        >
                                            {serial.serial_number}
                                        </button>
                                    ))}
                                </div>

                            </div>

                        </div>


                    </div>
                    }

                    {tab === 2 && <div style={report} >
                        <div style={{ width: '20%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '90%', backgroundColor: 'rgb(163, 187, 197)', height: '80%', display: 'flex', borderRadius: '26px', justifyContent: 'center', alignItems: 'center', marginTop: '42px', marginLeft: '109px', flexDirection: 'column' }}>
                            <div style={{ width: '100%', height: 'auto', display: 'flex', overflowY: 'scroll', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(163, 187, 197)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style> {`div::-webkit-scrollbar { display: none;}`}</style>
                                <DataTable
                                    columns={column}
                                    data={data}
                                // pagination
                                ></DataTable>
                                {/* <span>The standard Lorem Ipsum passage, used since the 1500s
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

                                    Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
                                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"

                                    1914 translation by H. Rackham
                                    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"

                                    Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
                                    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."

                                    1914 translation by H. Rackham
                                    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."
                                    </span> */}
                            </div>
                        </div>


                    </div>
                    }
                </div>
            </Modal>

            <Modal isOpen={isIssueLoaderOpen} onRequestClose={closeIssueLoader} className={modal} >
                <div style={{ display: 'flex', flexDirection: 'column', zIndex: '20', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
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