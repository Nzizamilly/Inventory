import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from 'react-modal';
import { CSVLink } from 'react-csv'

function ItemTransactionsAdmins() {

  const [report, setReport] = useState([]);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const kindaStyle = {
    width: '70%',
    marginLeft: '273px',
    marginBottom: '1px',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const url = process.env.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get(`${url}/monthly-report/${startDate}/${endDate}`);
        setReport(response.data);
        setRecords(response.data);
      } catch (error) {
        // console.error('Error fetching Data', error);
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
      name: 'Item in-Stock',
      selector: (row) => row.amount_entered,
    },
    {
      name: 'Went Out',
      selector: (row) => row.amount_went_out,
    },
    {
      name: 'Requestor',
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

  const handlePrint = () => {
    window.print();
  };

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

  const fileName = `Transaction Report From ${startDate} to ${endDate}`;

  return (
    <div>
      <NavbarAdmin />
      <div style={kain}>
        <h1> Item Report Tab</h1>
      </div>
      <div className="transaction-container-admin">
        <div style={kindaStyle}>
          <input type="text" placeholder="Search By Item Name" onChange={handleFilter} />
          <br />
          <div>
            From: <input type="date" onChange={(e) => setStartDate(e.target.value)} className='' />
            To: <input type="date" onChange={(e) => setEndDate(e.target.value)} className='' />
          </div>
          <br />
          <div style={{ display: 'flex', gap: '9px', flexDirection: 'inline' }}>
            <button className='buttonStyle2' onClick={handlePrint}>Print</button>
            <CSVLink data={records} filename={fileName}> <button className='buttonStyle2'>Export</button></CSVLink>
          </div>
          <br />
          <DataTable columns={columns} data={records} pagination />
        </div>
      </div>
    </div>
  );
};

export default ItemTransactionsAdmins;
