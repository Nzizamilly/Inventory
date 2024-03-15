import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from 'react-modal';
import { format } from 'date-fns';

function ItemTransactionsAdmin() {
  const [report, setReport] = useState([]);
  const [records, setRecords] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const openItemTransaction = () => {
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
  };

  const buttonStyle = {
    color: 'white',
    width: '109%',
    height: '23px',
    padding: '5px 12px',
    borderRadius: '45px',
    backgroundColor: 'black',
  };

  const modalStyles = {
    content: {
      top: '50%',
      width: '90%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      borderRadius: '12px',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.9,
      fontFamily: 'Your Custom Font, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      lineHeight: '1.5',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  const kindaStyle = {
    width: '70%',
    marginLeft: '273px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/monthly-report/${startDate}/${endDate}`,);
        setReport(response.data);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching Data', error);
      }
    };

    fetchMonthlyReport();
  }, [startDate, endDate]);

  useEffect(() => {
    setRecords(report);
  }, [report]);

  const columns = [
    {
      name: 'Date',
      selector: (row) => row.transaction_date,
    },
    {
      name: 'Item',
      selector: (row) => row.item_name,
    },
    {
      name: 'Item Entered',
      selector: (row) => row.amount_entered,
    },
    {
      name: 'Went Out',
      selector: (row) => row.amount_went_out,
    },
    {
      name: 'Taker',
      selector: (row) => row.taker_name,
    },
    {
      name: 'Current Balance',
      selector: (row) => row.total_items_in,
    },
  ];

  const handleFilter = (event) => {
    const newData = report.filter((row) => {
      return row.item_name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  const handleDateFilter = () => {
    const filteredData = report.filter((row) => {
      const rowDate = new Date(row.month).getTime();
      const startTimestamp = startDate ? new Date(startDate).getTime() : null;
      const endTimestamp = endDate ? new Date(endDate).getTime() : null;

      if (startTimestamp && endTimestamp) {
        return rowDate >= startTimestamp && rowDate <= endTimestamp;
      } else if (startTimestamp) {
        return rowDate >= startTimestamp;
      } else if (endTimestamp) {
        return rowDate <= endTimestamp;
      }
      return true;
    });

    setRecords(filteredData); // Update the 'records' state with filtered data
  };

  const handlePrint = () => {
    window.print();
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
  };

 


  return (
    <div>
      <NavbarAdmin />
      <div style={kain}>
        <h1> Item Transactions Tab</h1>
      </div>
      <div className="transaction-container-admin">
        <div style={kindaStyle}>
          <input type="text" placeholder="Search By Item Name" onChange={handleFilter} />
          <br />
          <div>
            From: <input type="date" onChange={(e) => setStartDate(e.target.value)} className='' />
            To: <input type="date" onChange={(e) => setEndDate(e.target.value)} className='' />
            {/* <button onClick={handleDateFilter}>Apply Filter</button> */}
          </div>
          <br />

           
          <button onClick={handlePrint}>Print</button>
          <br />
          <DataTable columns={columns} data={records}  />
        </div>
      </div>
    </div>
  );
}

export default ItemTransactionsAdmin;
