import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";

function Account() {
  const [emps,setEmps] = useState([]);

  useEffect(()=>{
    const fetchEmp = async () => {
      try {
        const res = await axios.get("http://localhost:5500/employee");
        setEmps(res.data);
        console.log("Emps: ", res.data)
      }catch (error){
         console.error("Problem", error);
      }
    };
    fetchEmp();
    console.log("Emps: ", emps)
  },[]);
  return (
    <div className="account-container">
      {emps.map((emp) =>(
        <div key = {emp.id} className="account">
          <h1>{emp.username}</h1>
          <img src = {emp.profile_picture} id='profile_picture' alt ="" />
          <p>Username: {emp.username}</p>
          <p>Password: {emp.password}</p>
          <p>Position: {emp.position}</p>
          <p>Department: {emp.department}</p>
          <p>Immediate Supervisor: {emp.immediate_supervisor}</p>
          <Link to={'/'}><button>Update</button></Link>
        </div>
))}
    </div>
  );
}

export default Account;
