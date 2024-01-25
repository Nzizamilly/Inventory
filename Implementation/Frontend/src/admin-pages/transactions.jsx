import React, { useState, useEffect } from 'react';
import '../style.css';
import DataTable from 'react-data-table-component';
import axios from 'axios';


function TransactionsAdmin() {

  const buttonStyle = {
    backgroundColor: 'cyan',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '45px',
  };
  const svgStyle = {
    // backgroundColor: 'green',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }
  const svgStyleCross = {
    backgroundColor: 'red',
    width: '40px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '1px'
  }

  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get('http://localhost:5500/monthly-report');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching Data', error);
      }
    };

    fetchMonthlyReport();
  }, [])

  const columns = [
    {
      name: 'Month',
      selector: row => row.month
    },
    {
      name: 'Item',
      selector: row => row.item_name
    },
    {
      name: 'Entered',
      selector: row => row.amount_entered
    }, {
      name: 'Went Out',
      selector: row => row.amount_went_out
    }, {
      name: 'Taker',
      selector: row => row.taker_name
    },
  ]

  return (
    <div className="transaction-container-admin">
      <div>
       <DataTable
       columns={columns}
       data={report}
       pagination
       ></DataTable>
      </div>
    </div>
  );
}


export default TransactionsAdmin;
