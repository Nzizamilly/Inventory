import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function Account() {
  const [emps,setEmps] = useState([]);

  useEffect(()=>{
    const fetchEmp = async () => {
      try {
        const res = await axios.get("https://localhost:5500/");
        setEmps(res.data);
      }catch (err){
         console.log(err);
      }
    };
    fetchEmp();
  },[]);
  return (
    <div className="account-container">
      {emps.map((emp) =>(
        <div key = {emp.id} className="account">
          <h1>{emp.username}</h1>
          <img src = {emp.cover} alt ="" />
          <p>{emp.username}</p>
          <p>{emp.password}</p>
          <p>{emp.profile_picture}</p>
          <p>{emp.position}</p>
          <p>{emp.department}</p>
          <p>{emp.immediate_supervisor}</p>
          <button><Link to={'/'}>Update</Link></button>
        </div>
))}
    </div>
  );
}

export default Account;
