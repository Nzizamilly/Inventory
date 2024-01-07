import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Model from 'react-modal'
import Add from '../images/add.svg'

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
  
  const color ={
    color: 'green'
  }

  const svgStyle={
    // backgroundColor: 'green',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const [emps, setEmps] = useState([]);

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

  const [update, setUpdate] = useState({
    username: '',
    password: '',
    role: '',
    department: '',
    profile_pricture: '',
    status: ''
  });

  const location = useLocation();

  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const EmpID = localStorage.getItem("userID");
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

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] =useState(false);
 const [employee, setEmployee] = useState({
    username: '',
    password: '',
    role: '',
    department: '',
    profile_pricture: '',
    status: ''
  })
   const handleChange2 = (event)=>{
    setEmployee((prev) => ({...prev, [event.target.name]: event.target.value}));
   };
   const handleMake = async (event) => {
    try {
      await axios.post(`http://localhost:5500/add-employee`, employee);
      console.log("Employee added successfully")
      setAddVisible(false);
    } catch {
       console.log('Error')
    }
   }

  return (
    <div className='employee-container'>
      <button onClick={()=> setAddVisible(true)} className='add-btn'><img src = {Add} style={svgStyle}/><p>Add Employee</p></button>
      <Model isOpen={addVisible} onRequestClose={()=>setAddVisible(false)} style={modal}>
            <h1>Add Employee</h1>
            <input type='text' placeholder='Username' name='username' onChange={handleChange2}/>
            <input type='text' placeholder='Password' name='password' onChange={handleChange2}/>
            <input type='text' placeholder='Role' name='role' onChange={handleChange2}/>
            <input type='text' placeholder='department' name='department' onChange={handleChange2}/>
            <input type='text' placeholder='Status' name='status' onChange={handleChange2}/>
            <button onClick= {handleMake}>Submit</button>
      </Model>
      {emps.map((emp) => (
        <div key={emp.id} className="employee">
          <h1>{emp.username}</h1>
          <img src={emp.profile_picture} id='profile_picture' alt="" />
          <p>Username: {emp.username}</p>
          <p>Password: {emp.password}</p>
          <p>Position: {emp.role_name}</p>
          <p>Department: {emp.department_name}</p>
          <p>Status:  <span style={color}>{emp.status}</span></p>
          <button onClick={() => setVisible(true)}>Update</button>
          <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
            <h1>Update</h1>
            <input type='text' placeholder='Username' name="username" onChange={handleChange} />
            <input type='text' placeholder='Password' name="password" onChange={handleChange} />
            <input type='text' placeholder='Role' name="role" onChange={handleChange} />
            <input type='text' placeholder='Department' name="department" onChange={handleChange} />
            <input type='text' placeholder='Status' name="status" onChange={handleChange} />
            <button onClick={() => handleUpdate(emp.id)}>Submit</button>
          </Model>
        </div>
      ))}
      </div>
  );
}

export default EmployeesAdmin;
