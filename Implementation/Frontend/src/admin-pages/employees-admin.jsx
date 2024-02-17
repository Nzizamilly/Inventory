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
    display: 'flex',
    gap: '23px',
    paddingTop: '74px',
    flexDirection: 'row',
    overflow: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center'
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
  const [department, setDepartment] = useState([]);
  const [role, setRole] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
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
  }, [emps]);


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
          if (emp.id === empID) {
            return { ...emp, status };
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


  const handleDelete = async (empID) => {
    try {
      await axios.delete(`http://localhost:5500/delete-employee/${empID}`);
      console.log("Employee Deleted safely");
      window.alert("Done");
    } catch {
      console.error("No");
    }
  }

  const some = {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)',
    justifyContent: 'center',
    overflow: 'auto',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
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

  useEffect(() => {
    const getDept = async () => {

      const response = await axios.get("http://localhost:5500/get-department/");
      setDepartment(response.data);
    }
    getDept()
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for Department", typeof selectedValue);
    setSelectedDepartment(selectedValue);
  }
  const Select = {
    width: '65%',
    height: '28%',
    color: 'black',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '21px'
  };

  useEffect(() => {
    const fetchRole = async (selectedDepartment) => {
      const response = await axios.get(`http://localhost:5500/get-role/${selectedDepartment}`);
      setRole(response.data);
      console.log("DATA: ", response.data)
    }
    if (selectedDepartment) {
      fetchRole(selectedDepartment);
    }
  }, [selectedDepartment])

  const handleRoleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for role", typeof selectedValue);
    setSelectedRole(selectedValue);
  }
  const OptionColor = {
    width: '39%',
    height: '25%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  }
 

  const [employee, setEmployee] = useState({
    username: '',
    password: '',
    departmentName : '',
    roleName: '',
  })
  useEffect(() => {
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      departmentName: selectedDepartment,
      roleName: selectedRole,
    }));
  }, [selectedDepartment, selectedRole]);


  const handleMake = async (event) => {
    try {
      console.log("Passing Data: ", employee)
      await axios.post(`http://localhost:5500/employee`, employee);
      window.alert("Employee added successfully");
      setAddVisible(false);
    } catch (error) {
      console.log('Error', error)
    }
  }

  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>Add A New Employee</h1>
      </div>
      <div style={some}>
        <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /><p>Add Employee</p></button>
        <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
          <h2>Adding a new Employee</h2>
          <input type='text' placeholder='Username' name='username' onChange={handleChange2} />
          <input type='text' placeholder='Password' name='password' onChange={handleChange2} />

          <select onChange={handleDepartmentChange} value={selectedDepartment} style={Select}>
            <option value='' disabled>Select Department</option>
            {department.map(departments => (
              <option key={departments.id} value={departments.id}>{departments.department_name}</option>
            ))}
          </select>

          <select onChange={handleRoleChange} value={selectedRole} style={Select}>
            <option value='' disabled>Select Role</option>
            {role.map(roles => (
              <option key={roles.id} value={roles.id} style={OptionColor}>{roles.role_name}</option>
            ))}
          </select>
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
              <button className='addItem-btn' onClick={() => handleDelete(emp.id)} ><img src={Delete} style={svgStyle} /></button>
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
