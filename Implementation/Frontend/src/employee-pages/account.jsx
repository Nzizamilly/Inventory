import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Model from 'react-modal'

function Account() {

  const modal = {
    overlay: {
      backgroundColor: 'rgba(34, 41, 44, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '29%',
      marginLeft: '595px',
      // marginTop: '99px',
      // height: '64vh',
      backgroundColor: 'rgb(56, 59, 61)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const [emps, setEmps] = useState([]);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get("http://localhost:5500/employee");
        setEmps(res.data);
        // console.log("Emps: ", res.data)
      } catch (error) {
        // console.error("Problem", error);
      }
    };
    fetchEmp();
  }, [emps]);

  const [update, setUpdate] = useState({
    username: '',
    position: '',
    department: '',
    immediate_supervisor: ''
  });

  const location = useLocation();
  const EmpID = location.pathname.split("/")[2];

  const handleChange = (e) => {
    setUpdate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleClick = async (event) => {
    event.preventDefault();
    try {
      console.log('update data:', update)
      await axios.put(`http://localhost:5500/employee/${EmpID}`, update);
      setEmps((prevEmps)=>{
        prevEmps.forEach((emp, index)=> {
          if (emp.id === EmpID) {
            prevEmps[index] = { ...emp, ...update};
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
  // console.log('Is modal visible', visible);

  return (
    <div className="account-container">
      {emps?.map((emp) => (
        <div key={emp.id} className="account">
          <h1>{emp.username}</h1>
          <img src={emp.profile_picture} id='profile_picture' alt="" />
          <p>Username: {emp.username}</p>
          <p>Password: {emp.password}</p>
          <p>Position: {emp.position}</p>
          <p>Department: {emp.department}</p>
          <p>Immediate Supervisor: {emp.immediate_supervisor}</p>
          <button onClick={() => setVisible(true)}>Update</button>
          <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
            <h1>Update</h1>
            <input type='text' placeholder='Username' name = "username"onChange={handleChange} />
            <input type='text' placeholder='Position' name = "position"onChange={handleChange} />
            <input type='text' placeholder='Department' name = "department"onChange={handleChange} />
            <input type='text' placeholder='Immediate Supervisor' name='immediate_supervisor' onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
          </Model>
        </div>
      ))}
    </div>
  );
}

export default Account;
