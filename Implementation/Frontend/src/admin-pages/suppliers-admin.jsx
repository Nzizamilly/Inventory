import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import NavbarAdmin from './navbarAdmin';
import Model from 'react-modal'
import Modal from 'react-modal';
import DataTable from 'react-data-table-component';
import Add from '../images/add.svg'
import Info from '../images/info.svg'

function SupplierAdmin() {

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
      backgroundColor: 'rgb(206, 206, 236)',
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
  }

  const employeeContainer = {
    // gap: '51px',
    width: '100%',
    height: '120vh',
    display: 'flex',
    flexWrap: 'wrap',
    overFlow: 'auto',
    alignItems: 'center',
    // justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(163, 187, 197)',
  }

  const color = {
    color: 'green'
  }

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const [suppliers, setSuppliers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [singelSupplier, setSingleSupplier] = useState([])
  const [addVisible, setAddVisible] = useState(false);
  const [oneEmployee, setOneEmployee] = useState(false);
  const [update, setUpdate] = useState({
    first_name: '',
    address: '',
    phone: '',
    email: '',
    status: ''
  });
  const [supp, setSupp] = useState({
    first_name: '',
    address: '',
    phone: '',
    email: '',
    status: ''
  });

  const openInfoModal = (ID) => {
    setOneEmployee(true)
    bringOneSupplier(ID)
  }

  const closeOneEmployee = () => {
    setOneEmployee(false)
  }

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:5500/supplier`);
        setSuppliers(res.data);
      } catch (error) {
      }
    };
    fetchSupplier();
  }, [suppliers]);


  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleUpdate = async (id) => {
    try {
      console.log("Updatiess: ", update);
      const response = await axios.put(`http://localhost:5500/supplier/${id}`);
      console.log("Updated Well!", response.info);
    } catch (error) {
      console.error("Error: ", error)
    };
  }

  const handleChange2 = (event) => {
    setSupp((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleMake = async () => {
    try {
      await axios.post(`http://localhost:5500/supplier`, supp);
      console.log("Supplier added successfully")
      setAddVisible(false);
    } catch {
      console.log('Error')
    }
  }
  const kain = {
    marginLeft: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(163, 187, 197)',
    paddingTop: '70px',
    display: 'flex',
    marginLeft: '23px',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black',
    gap: '12px'
  }

  const bringOneSupplier = async (ID) => {
    console.log("ID: ", ID);
    try {
      const response = await axios.get(`http://localhost:5500/supplier/${ID}`);
      setSuppliers(response.data)
      setSingleSupplier(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  }

  const columns = [
    {
      name: 'Supplier Name',
      selector: row => row.first_name
    },
    {
      name: 'Address',
      selector: row => row.address
    }, {
      name: 'More Info',
      cell: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id)}><img src={Info} style={svgStyle} /></button>
      )
    },
  ]


  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>List Of Suppliers</h1>
        <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /><p>Add Supplier</p></button>
      </div>
      <div style={employeeContainer}>

        <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
          <h1>Add Supplier</h1>
          <input type='text' placeholder='First Name' name='first_name' onChange={handleChange2} />
          <input type='text' placeholder='Address' name='address' onChange={handleChange2} />
          <input type='text' placeholder='Phone' name='phone' onChange={handleChange2} />
          <input type='text' placeholder='Email' name='email' onChange={handleChange2} />
          <input type='text' placeholder='Status' name='status' onChange={handleChange2} />
          <button onClick={handleMake}>Submit</button>
        </Model>

        <div style={{backgroundColor: "black",width: '90%', marginTop: '12px', overFlow: 'auto', marginLeft: '220px'}}>
          <DataTable
            data={suppliers}
            columns={columns}
            pagination
          ></DataTable>

          <Modal isOpen={oneEmployee} onRequestClose={closeOneEmployee} style={modal}>
            {singelSupplier.map((supplier) => (
              <div key={supplier.id} className="employee">
                <div className="bigger">
                  <p>{supplier.first_name && supplier.first_name.charAt(0).toUpperCase()}</p>
                </div>
                <p>Name: {supplier.first_name}</p>
                <p>Address: {supplier.address}</p>
                <p>Phone: {supplier.phone}</p>
                <p>Email: {supplier.email}</p>
                <p>Status:  <span style={color}>{supplier.status}</span></p>
                <button onClick={() => setVisible(true)}>Update</button>
                <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
                  <h1>Update</h1>
                  <input type='text' placeholder="Supplier's Name" name='first_name' onChange={handleChange} />
                  <input type='text' placeholder='Address' name='address' onChange={handleChange} />
                  <input type='text' placeholder='Phone' name='phone' onChange={handleChange} />
                  <input type='text' placeholder='Email' name='email' onChange={handleChange} />
                  <input type='text' placeholder='Status' name='status' onChange={handleChange} />
                  <button onClick={() => handleUpdate(supplier.id)}>Submit</button>
                </Model>
              </div>
            ))}
          </Modal>
        </div>

      </div>
    </div>
  );
}

export default SupplierAdmin;
