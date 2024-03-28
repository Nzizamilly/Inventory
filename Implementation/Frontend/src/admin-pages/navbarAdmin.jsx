import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Info from '../images/info.svg';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'

function NavbarAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [openActionTransaction, setOpenActionTransaction] = useState(false);
  const [openItemTransaction, setOpenItemTransaction] = useState(false)
  //

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

  const modalStyles2 = {
    content: {
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '192px',
      height: '82px',
      borderRadius: '12px'
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

  const actionFunction = () => {
    setOpenActionTransaction(true);
    setIsItemModalOpen(true);
  };

  const itemFunction = () => {
    setOpenItemTransaction(true);
  }

  const openLink = () => {
    setIsLinkOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false)
  };

  const closeLink = () => {
    setIsLinkOpen(false);
  }


  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const [transactionType, setTransactionType] = useState('');
  // const history = useHistory();

  const handleTransactionChange = (event) => {
    const selectedTransactionType = event.target.value;
    setTransactionType(event.target.value);

    if (selectedTransactionType === "item") {
      navigate('/item-transaction')
    } else {
      navigate('/action-transaction')
    }
  };

  const select = {
    display: 'block',
    padding: '12px 12px',
    borderRadius: '12px',

    textDecoration: 'none',
    color: 'rgb(5, 5, 5)',
    width: '209px',
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

  return (
    <div >
      <ul className='ul1Admin'>
        <li className='li1Admin' onClick={handleLogout}><Link to={'/'}>Log Out</Link></li>
        <li className='li1Admin'><Link to={'/home-admin'}>Home</Link></li>
      </ul>
      <ul className='ul2Admin'>
        <li className='liAdmin'><Link to={'/account-admin'} onMouseOver={openModal}>Account</Link></li>
        <li className='liAdmin'><Link to={'/items-admin'}>Items</Link></li>
        <li className='liAdmin'><Link to={'/employees-admin'}>Employees</Link></li>
        <li className='liAdmin'><Link to={'/category-admin'}>Category</Link></li>
        <li className='liAdmin'><Link to={'/notification-admin'}>Notification</Link></li>
        <select onChange={handleTransactionChange} value={transactionType} style={select}>
          <option style={select}value="" disabled>Transaction</option>
          <option style={select}value="item">Item Transaction</option>
          <option style={select}value="action">Action Transaction</option>
        </select>
        {/* <li className='liAdmin'><Link to={'/transaction-admin'} onMouseOver={openLink}>Transactions</Link></li> */}
        <li className='liAdmin'><Link to={'/supplier-admin'}>Suppliers</Link></li>
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
