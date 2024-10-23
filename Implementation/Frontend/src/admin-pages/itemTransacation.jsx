import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Modal from 'react-modal';
import { CSVLink } from 'react-csv'
import Keys from '../keys';

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

  const url = Keys.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        console.log('Dates: ', startDate, endDate)
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
    let printContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0%;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0 auto;
            max-width: 800px;
            padding: 20px;
            /* display: flex;
            flex-direction: inline; */
        }

        .title {
            text-align: center;
        }

        .letterhead {
            /* margin-bottom: 20px; */
            /* padding-bottom: 10px; */
            display: flex;
            width: 100%;
            height: 23%;
            gap: 303px;
            /* justify-content: flex-end; */
            /* padding: 20px; */
        }

        .report {
            margin-top: 32px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }


        .contact-info {
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .delivery-note {
            text-decoration: underline;
            font-weight: bold;
            margin-bottom: 10px;
        }

        table {
            width: 100%;

            border-collapse: collapse;
            border-radius: 12px;
            border: 1px solid #ccc;
            overflow: hidden;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="all">
        <div class="letterhead">
            <div style="width: 40%; height: 40%; ">
                <img src="https://firebasestorage.googleapis.com/v0/b/inventoryquotation.appspot.com/o/Centrikalogo%2Fcentrika-removebg.png?alt=media&token=cfce643f-ba97-4fc8-8a05-8571d0a9ce79"
                    alt="centrika-removebg" style="width: 200px; height: 130px;" />
            </div>


            <div style="margin-right: 30px; display: flex; ">
                <div class="address">
                    <p>P.O. Box: 4097 Kigali-Rwanda</p>
                    <p>KN 2, Nyarugenge Kigali-Rwanda</p>
                    <p>Tel: +250 731 000 100</p>
                    <p>Email: info@centrika.rw</p>
                    <p>Website: <a href="http://www.centrika.rw">www.centrika.rw</a></p>
                </div>
            </div>
        </div>

        <div class="report">
            <h1>Inventory Report</h1>
            <table border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr>
                    <th>Date</th>
                        <th>Item</th>
                        <th>Number In Stock</th>
                        <th>Number Out</th>
                        <th>Requestor</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>

                 ${records.map(record => `
                 <tr>
                 <td>${record.transaction_date}</td>
                 <td>${record.item_name}</td>
                 <td>${record.amount_entered}</td>
                 <td>${record.amount_went_out}</td>
                 <td>${record.taker_name}</td>
                 <td>${record.total_items_in}</td>
                 </tr>
                 `).join('')}
                </tbody>
            </table>
        </div>
</body>
</html>`;

    const printWindow = window.open('', '', 'width=900,height=650')
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
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
          <div style={{ width: '100%', display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: 'inline'}}>
           <p style={{marginTop: '5px'}}>From:</p> <input type="date" onChange={(e) => setStartDate(e.target.value)} style={{ width: '20%', borderRadius: '20px',  display: 'flex', justifyContent: 'center', border: 'none' }} />
            <p style={{marginTop: '5px'}}>To:</p> <input type="date" onChange={(e) => setEndDate(e.target.value)} style={{ width: '20%', borderRadius: '20px',  display: 'flex', justifyContent: 'center', border: 'none' }} />
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
