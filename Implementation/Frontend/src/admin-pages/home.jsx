import React, { useState } from 'react';
import User from '../images/user.svg';
import Request from '../images/request.svg';
import Category from '../images/category.svg';
import Employees from '../images/employees.svg';
import Items from '../images/items.svg';
import Supplier from '../images/supplier.svg';
import Notification from '../images/notification.svg';
import Transaction from '../images/transaction.svg';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    useEffect(()=>{
        axios.get('http://localhost:5500')
        .then(res => {
            if(res.data.valid) {
                setName(res.data.username);
            }else{
                navigate('/')
            }
        })
        .catch(err => console.log(err))
    }, [])
    return (
        <div className="icon-container-admin">
            <div className="icons-admin">
                <img className='img1' src={User} alt='img1' />
                <p>Account: {name}</p>
            </div>
            <div className="icons1-admin">
                <img className='img1' src={Category} alt='img2' />
                <p>Category: 32</p>
            </div>
            <div className="icons2-admin">
                <img className='img1' src={Items} alt='img3' />
                <p> Items: 2</p>
            </div>
            <div className="icons3-admin">
                <img className='img1' src={Employees} alt='img3' />
                <p>Employees: 2</p>
            </div>
             <div className="icons4-admin">
                <img className='img1' src={Request} alt='img3' />
                <p>Requests: 2</p>
            </div>
            <div className="icons5-admin">
                <img className='img1' src={Transaction} alt='img3' />
                <p>Transactions: 2</p>
            </div>
            <div className="icons6-admin">
                <img className='img1' src={Supplier} alt='img3' />
                <p>Suppliers: 2</p>
            </div>
        </div>
    );
}

export default Home;
