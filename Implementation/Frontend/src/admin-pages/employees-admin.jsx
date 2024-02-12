import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Model from 'react-modal'
import Switch from 'react-switch'
import Add from '../images/add.svg'
import '../style.css'
import NavbarAdmin from './navbarAdmin';
import Update from '../images/update.svg'
import Delete from '../images/delete.svg'
import Deactivate from '../images/deactivate.svg'

function EmployeesAdmin() {

  const modal = {
    overlay: {
      // backgroundColor: 'rgb(163, 187, 197)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      // marginTop: '99px',
      height: '72vh',
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

    width: '100%',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)',
    justifyContent: 'center',
    // justifyContent: 'flex-start',
    display: 'flex',
    gap: '23px',
    paddingTop: '74px',
    flexDirection: 'row',
    overflow: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center'

    // fontFamily: 'Arial, sans-serif',
    // width: '100%',
    // height: '100vh',
    // backgroundColor: 'rgb(163, 187, 197)',
    // justifyContent: 'center',
    // alignItems: 'center',
    // display: 'flex',
    // gap: '51px',
    // flexWrap: 'wrap'
  }

  const ThemBs = {
    display: 'flex',
    // backgroundColor: 'black',
    gap: '9px',
    flexDirection: 'row'
  }

  const svgStyle = {
    backgroundColor: 'rgb(206, 206, 236)',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const [emps, setEmps] = useState([]);
  const [update, setUpdate] = useState({
    username: '',
    password: '',
    role: '',
    department: '',
    profile_pricture: '',
    status: ''
  });
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const location = useLocation();
  const [switchStates, setSwitchStates] = useState({});
  const [employee, setEmployee] = useState({
    username: '',
    password: '',
    roleName: '',
    departmentName: '',
    profile_pricture: '',
    status: ''
  })
  const EmpID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get(`http://localhost:5500/employees`);
        setEmps(res.data);
      } catch (error) {
      }
    };
    fetchEmp();
  }, []);


  const handleSwitchChange = async (checked, empID) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [empID]: checked,
    }));

    const status = checked ? 'ACTIVE' : 'INACTIVE';

    try {
      console.log("Emp ID: ", empID);
      const response = await axios.put(`http://localhost:5500/deactivate-employee/${empID}`, {
        status,
        employee
      });
      console.log('Backed Said Yes: ');

      setEmps((prevEmps) => {
        return prevEmps.map((emp) => {
          if (emp.id === empID){
            return {...emp, status};
          }
          return emp;
        });
      });
    } catch (error) {
      console.error('Error updating data: ', error);
    }

  }

  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleUpdate = async (event) => {
    try {
      await axios.put(`http://localhost:5500/employee/${EmpID}`, update);
      setEmps((prevEmps) => {
        prevEmps.forEach((emp, index) => {
          if (emp.id === EmpID) {
            prevEmps[index] = { ...emp, ...update };
          }
        });
        return [...prevEmps];
      });
      setVisible(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange2 = (event) => {
    setEmployee((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const handleMake = async (event) => {
    try {
      await axios.post(`http://localhost:5500/add-employee`, employee);
      window.alert("Employee added successfully");
      setAddVisible(false);
    } catch(error) {
      console.log('Error', error)
    }
  }

  const handleDelete = async (empID) => {
    try{
     await axios.delete(`http://localhost:5500/delete-employee/${empID}`);
     console.log("Employee Deleted safely");
     window.alert("Done");
    }catch{
      console.error("No");
    }
  }

  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
    <div style={employeeContainer}>
      <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /><p>Add Employee</p></button>
      <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
        <h1>Add Employee</h1>
        <input type='text' placeholder='Username' name='username' onChange={handleChange2} />
        <input type='text' placeholder='Password' name='password' onChange={handleChange2} />
        <input type='text' placeholder='Role' name='role' onChange={handleChange2} />
        <input type='text' placeholder='Department' name='department' onChange={handleChange2} />
        <input type='text' placeholder='Status' name='status' onChange={handleChange2} />
        <button onClick={handleMake}>Submit</button>
      </Model>
      {emps.map((emp) => (
        <div key={emp.id} className="employee">
          <h1>{emp.username}</h1>
          <img src={emp.profile_picture} id='profile_picture' alt="" />
          <p>Username: {emp.username}</p>
          <p>Password: {emp.password}</p>
          <p>Position: {emp.role_name}</p>
          <p>Department: {emp.department_name}</p>
          <p>Status:  <span style={{ color: emp.status === 'INACTIVE' ? 'red' : 'green' }}>{emp.status}</span></p>
          <div style={ThemBs}>
            <button className='addItem-btn' onClick={() => setVisible(true)}><img src={Update} style={svgStyle} /></button>
            <button className='addItem-btn' onClick={()=>handleDelete(emp.id)} ><img src={Delete} style={svgStyle} /></button>
            <Switch onChange={(checked) => handleSwitchChange(checked, emp.id)} checked={switchStates[emp.id] || false} />
          </div>
          <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
            <h1>Update</h1>
            <input type='text' placeholder='Username' name="username" onChange={handleChange} />
            <input type='text' placeholder='Password' name="password" onChange={handleChange} />
            <input type='text' placeholder='Role' name="roleName" onChange={handleChange} />
            <input type='text' placeholder='Department' name="departmentName" onChange={handleChange} />
            <input type='text' placeholder='Status' name="status" onChange={handleChange} />
            <button onClick={() => handleUpdate(emp.id)}>Submit</button>
          </Model>
        </div>
      ))}
    </div>
    </div>
  );
}

export default EmployeesAdmin;
