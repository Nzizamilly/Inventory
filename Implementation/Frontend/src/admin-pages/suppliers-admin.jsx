import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import NavbarAdmin from './navbarAdmin';
import Model from 'react-modal'
import Add from '../images/add.svg'

function SupplierAdmin() {

  const modal = {
    overlay: {
      // backgroundColor: 'rgb(163, 187, 197)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '33%',
      marginLeft: '495px',
      height: '77vh',
      backgroundColor: 'rgb(163, 187, 197)',
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
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    gap: '51px',
    flexWrap: 'wrap'
  }

  const color = {
    color: 'green'
  }

  const svgStyle = {
    // backgroundColor: 'green',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const [suppliers, setSuppliers] = useState([]);

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

  const [update, setUpdate] = useState({
    first_name: '',
    second_name: '',
    address: '',
    phone: '',
    email: '',
    status: ''
  });

  const location = useLocation();

  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const EmpID = localStorage.getItem("userID");
  
  

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  
  const [supp, setSupp] = useState({
    first_name: '',
    second_name: '',
    address: '',
    phone: '',
    email: '',
    status: ''
  })
  const handleChange2 = (event) => {
    setSupp((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleMake = async (event) => {
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
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black'
  }


  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>Add A New Supplier</h1>
      </div>
    <div style={employeeContainer}>
      <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /><p>Add Supplier</p></button>

      <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
        <h1>Add Supplier</h1>
        <input type='text' placeholder='First Name' name='first_name' onChange={handleChange2} />
        <input type='text' placeholder='Second name' name='second_name' onChange={handleChange2} />
        <input type='text' placeholder='Address' name='address' onChange={handleChange2} />
        <input type='text' placeholder='Phone' name='phone' onChange={handleChange2} />
        <input type='text' placeholder='Email' name='email' onChange={handleChange2} />
        <input type='text' placeholder='Status' name='status' onChange={handleChange2} />
        <button onClick={handleMake}>Submit</button>
      </Model>

      {suppliers.map((supplier) => (
        <div key={supplier.id} className="employee">
          <div className="bigger">
          <p>{supplier.first_name && supplier.first_name.charAt(0).toUpperCase()}</p>
          </div>
          <p>First Name: {supplier.first_name}</p>
          <p>Address: {supplier.address}</p>
          <p>Phone: {supplier.phone}</p>
          <p>Email: {supplier.email}</p>
          <p>Status:  <span style={color}>{supplier.status}</span></p>
          <button onClick={() => setVisible(true)}>Update</button>
          <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
            <h1>Update</h1>
            <input type='text' placeholder='First Name' name='first_name' onChange={handleChange} />
            <input type='text' placeholder='second_name' name='second_name' onChange={handleChange} />
            <input type='text' placeholder='Address' name='address' onChange={handleChange} />
            <input type='text' placeholder='Phone' name='phone' onChange={handleChange} />
            <input type='text' placeholder='Email' name='email' onChange={handleChange} />
            <input type='text' placeholder='Status' name='status' onChange={handleChange} />
            {/* <button onClick={() => handleUpdate(supplier.id)}>Submit</button> */}
          </Model>
        </div>
      ))}
    </div>
    </div>
  );
}

export default SupplierAdmin;
