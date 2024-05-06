import { Link, useNavigate } from 'react-router-dom';
import Centrika from '../images/centrika-removebg.png';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Modal from 'react-modal'

function NavbarAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const modalStyles = {
    content: {
      top: '18%',
      width: '20%',
      left: '20%',
      right: 'auto',
      gap: '12px',
      borderRadius: '12px',
      height: '25%',
      marginRight: '-20%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.9,
      fontFamily: 'Your Custom Font, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      color: 'white',
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const [transactionType, setTransactionType] = useState('');

  const handleTransactionChange = (event) => {
    setTransactionType(event.value);
  };

  useEffect(()=>{
    const changeTransaction = (transactionType) => {
      if(transactionType === 'item') {
        navigate('/item-transaction')
      }else if(transactionType){
      navigate('/action-transaction')
      };
    }
    changeTransaction(transactionType);
  },[transactionType]);

  const select = {
    display: 'block',
    padding: '12px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'rgb(5, 5, 5)',
    width: '198px',
    backgroundColor: 'black',
    color: 'white'

  }

  useEffect(() => {
    const fetchData = async () => {
      const EmpID = localStorage.getItem("userID");
      try {
        if (EmpID) {
          const response = await axios.get(`http://localhost:5500/employee/${EmpID}`);
          setData(response.data[0]);
        } else {
          console.error("EmpID Not found in localStorage")
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchData();
  }, []);

  const options = [
    { value: 'trusted', label: "Trusted Suppliers" },
    { value: 'local', label: "Local Suppliers" },
  ];

  const option = [
    { value: 'item', label: "Item Transaction" },
    { value: 'action', label: "Action Transaction" },
  ]

  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      '&:hover': {
        backgroundColor: 'lightgrey',
        color: 'black'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      width: '54px',
      height: '24px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
    })
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.value);
  };

  useEffect(() => {
    const changeSupplier = (selectedSupplier) => {
      if (selectedSupplier === 'trusted') {
        navigate('/trusted-suppliers');
      } else if (selectedSupplier === 'local') {
        navigate('/local-supplier-admin');
      };
    };
    changeSupplier(selectedSupplier);
  }, [selectedSupplier]);


  return (
    <div >
      <ul className='ul1Admin'>
        <li className='li1Admin' onClick={handleLogout}><Link to={'/'}>Log Out</Link></li>
        <li className='li1Admin'><Link to={'/home-admin'}>Home</Link></li>
        <li style={{ float: 'left', marginLeft: '193px' }} className='li1Admin'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
      </ul>
      <ul className='ul2Admin'>
        <li className='liAdmin'><Link to={'/account-admin'} onMouseOver={openModal}>Account</Link></li>
        <li className='liAdmin'><Link to={'/items-admin'}>Items</Link></li>
        <li className='liAdmin'><Link to={'/employees-admin'}>Employees</Link></li>
        <li className='liAdmin'><Link to={'/category-admin'}>Category</Link></li>
        <li className='liAdmin'><Link to={'/notification-admin'}>Notification</Link></li>
        
         <Select
          options={option}
          styles={customStyles}
          placeholder="Transactions"
          onChange={handleTransactionChange}
        />
        <Select
          options={options}
          styles={customStyles}
          placeholder="Suppliers"
          onChange={handleSupplierChange}
        />
        <li className='liAdmin'><Link to={'/departments-and-roles-admin'}>Department & Roles</Link></li>
        <li className='liAdmin'><Link to={'/terms-admin'}>Terms and Conditions</Link></li>
      </ul>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
        {data && (
          <>
            <p>Username: {data.username}</p>
            <p>Password: {data.password}</p>
            <p>Position: {data.role_name}</p>
            <p>Department: {data.department_name}</p>
          </>
        )}
      </Modal>
    </div>
  );
}
export default NavbarAdmin;
