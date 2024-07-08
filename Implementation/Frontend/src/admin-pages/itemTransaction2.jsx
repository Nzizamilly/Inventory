import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from 'react-modal';
import { CSVLink } from 'react-csv'
import { set } from 'firebase/database';
import Keys from '../keys';

function ItemTransactionsAdmin2() {

    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
    };

    const itemstyle = {
        width: '70%',
        left: '50%',
        gap: '18px',
        marginBottom: '990px',
        borderRadius: '12px',
        flexWrap: 'wrap',
        display: 'flex',
        backgroundColor: 'rgb(223, 225, 234)',
        padding: '12px 12px'
    };

    const buttonStyle12 = {
        width: '25%',
        height: '25%'
    };

    const modal = {
        overlay: {
            // width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '95%',
            marginLeft: '43px',
            height: '75vh',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '12px',
            gap: '23px',
            color: "black",
            padding: '12px 0px',
            fontFamily: 'Arial, sans- serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    const [smallData, setSmallData] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [totalSerialsIn, setTotalSerialsIn] = useState([]);
    const [totalSerialsOut, setTotalSerialsOut] = useState([]);
    const [serialNumbersForSingleItems, setSerialNumbersForSingleItem] = useState([]);
    const [totalNumberForSingleItem, setTotalNumberForSingleItem] = useState([]);
    const [isSingleItemModalOpen, setIsSingleItemModalOpen] = useState(false);
    const [isAllDataOpen, setIsAllOpen] = useState(false);
    const [IDForSerialCount, setIDForSerialCount] = useState()
    const [itemName, setItemName] = useState();
    const [IDForDates, setIDForDates] = useState('');
    const [count, setCount] = useState();
    const [endSingleItem, setEndSingleItem] = useState('');
    const [startSingleItem, setStartSingleItem] = useState('');

    const url = Keys.REACT_APP_BACKEND;



    const openAllModalOpen = () => {
        setIsAllOpen(true);
    };

    const closeAllDataModal = () => {
        setIsAllOpen(false);
    }

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const response = await axios.get(`${url}/get-all-items`);
                setSmallData(response.data);
            } catch (error) {
                console.error('Error fetching Data', error);
            };
        };
        fetchAllItems();
    }, []);


    useEffect(() => {
        const fetchCount = async () => {
            const response = await axios.get(`${url}/get-count-for-all-serial-numbers`);
            setCount(response.data);
        };
        fetchCount();
    }, [count]);


    const handleFilter = (event) => {
        const newData = smallData.filter((row) => {
            return row.name.toLowerCase().includes(event.target.value.toLowerCase());
        });
        setFilteredItems(newData);
    };

    useEffect(() => {
        setFilteredItems(smallData);
    }, [smallData]);


    const handleItemClick = (ID, name) => {
        setIsSingleItemModalOpen(true);
        setItemName(name)
        bringAllSerialsFor(ID);
        setIDForSerialCount(ID)
    };

    const closeSingleItemModal = () => {
        setIsSingleItemModalOpen(false)
    };

    const bringAllSerialsFor = async (ID) => {
        try {
            setIDForDates(ID);
            const response = await axios.get(`${url}/get-serial-numbers-for-item/${ID}`);
            setSerialNumbersForSingleItem(response.data);

        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const column = [
        {
            name: 'Serial Number',
            selector: row => row.serial_number
        },
        {
            name: 'State Of Item',
            selector: row => row.state_of_item
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'In / Out',
            selector: row => row.status
        },
        {
            name: 'Taker',
            selector: row => row.username
        },
    ];


    useEffect(() => {
        const fetchTotalNumberOfSerials = async () => {
            try {
                const response = await axios.get(`get-Total-Number-Of-Serials-For-single/${IDForSerialCount}`);
                setTotalNumberForSingleItem(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchTotalNumberOfSerials();
    }, [totalNumberForSingleItem]);


    useEffect(() => {
        const fetchSerialsIn = async () => {
            try {
                const response = await axios.get(`${url}/get-serial-In/${IDForSerialCount}`);
                setTotalSerialsIn(response.data)
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchSerialsIn();
    }, [totalSerialsIn]);

    useEffect(() => {
        const fetchSerialsOut = async () => {
            try {
                const response = await axios.get(`${url}/get-serial-Out/${IDForSerialCount}`);
                setTotalSerialsOut(response.data)
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchSerialsOut();
    }, [totalSerialsOut]);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        const dates = async () => {
            try {
                const responsee = await axios.get(`${url}/get-serial-number-in-different-time/${startSingleItem}/${endSingleItem}/${IDForDates}`);
                console.log("Dates Response: ", responsee.data);
                setSerialNumbersForSingleItem(responsee.data);

            } catch (error) {
                // console.error("Error: ", error);
            };
        };

        dates();
    }, [endSingleItem, startSingleItem, IDForDates]);

    const fileName = `Report of ${itemName}`;

    return (
        <div>
            <NavbarAdmin />
            <div style={kain}>
                <h1> Item Report Tab</h1>
            </div>
            <div className="transaction-container-admin">

                <div style={itemstyle}>
                    <div style={{ width: '95%', height: '25%', gap: '12px', display: 'flex', justifyContent: 'center', float: 'right' }}>
                        <input type='text' placeholder='Search For A Specific Item....' onChange={handleFilter} />
                        <p style={{ marginTop: '12px' }}>Total Items: {count}</p>
                    </div>
                    <br />
                    <br />
                    {filteredItems.map(small => (
                        <button key={small.id} onClick={() => handleItemClick(small.id, small.name)} style={buttonStyle12}>{small.name}</button>
                    ))}
                </div>

                <Modal isOpen={isSingleItemModalOpen} onRequestClose={closeSingleItemModal} style={modal}>
                    <div style={{ backgroundColor: 'white', width: '100%', height: '100%', }}>
                        <div style={{ backgroundColor: 'white', marginLeft: '12px', display: 'flex', gap: '14px', width: '100%' }}>
                            <input type='text' style={{ backgroundColor: 'black', width: '15%' }} placeholder='Search For A Serial Number...' />
                            <p style={{ marginTop: '12px' }}>From: </p> <input type='date' id='smallDate' style={{ width: '10%', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={(e) => setStartSingleItem(e.target.value)} />
                            <p style={{ marginTop: '12px' }}>To: </p> <input type='date' id='smallDate' style={{ width: '10%', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={(e) => setEndSingleItem(e.target.value)} />
                            <p style={{ marginTop: '12px' }}>{itemName} 's Serial Numbers</p>

                            {totalNumberForSingleItem.map(total => (
                                <p style={{ marginTop: '12px' }}>Total: {total},</p>
                            ))}
                            {totalSerialsIn.map(total => (
                                <p style={{ marginTop: '12px' }}>Total In: {total},</p>
                            ))} {totalSerialsOut.map(total => (
                                <p style={{ marginTop: '12px' }}>Total Out: {total},</p>
                            ))}

                            <button style={{ width: '6%', backgroundColor: 'blue', color: 'white' }} onClick={(handlePrint)}>Print</button>
                            <CSVLink data={serialNumbersForSingleItems} filename={fileName}> <button style={{ color: 'white', backgroundColor: 'blue' }}>Export</button></CSVLink>
                        </div>
                        <br />
                        <div style={{ backgroundColor: 'rgb(163, 187, 197)', height: '90%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '33px' }}>
                            <DataTable
                                data={serialNumbersForSingleItems}
                                columns={column}
                                pagination
                            ></DataTable>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isAllDataOpen} onRequestClose={closeAllDataModal}>

                </Modal>

            </div>
        </div>
    );
};

export default ItemTransactionsAdmin2;
