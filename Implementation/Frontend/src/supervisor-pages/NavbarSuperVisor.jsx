// import { Link, useNavigate } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal'
// import Centrika from '../images/centrika-removebg.png';


// function NavbarSuperVisor() {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const modalStyles = {
//     content: {
//       top: '18%',
//       width: '20%',
//       left: '20%',
//       right: 'auto',
//       gap: '12px',
//       borderRadius: '12px',
//       height: '23%',
//       marginRight: '-50%',
//       transform: 'translate(-50%, -50%)',
//       opacity: 0.9,
//       fontFamily: 'Your Custom Font, sans-serif',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       border: 'none',
//       color: 'white',
//       backgroundColor: 'black',
//       display: 'flex',
//       justifyContent: 'center',
//       flexDirection: 'column',
//       alignItems: 'center'
//     },
//     overlay: {
//       backgroundColor: 'rgba(0, 0, 0, 0.0)', // Adjust the background color and opacity
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//   }
//   const openModal = () => {
//     setIsModalOpen(true);
//   }

//   const closeModal = () => {
//     setIsModalOpen(false);
//   }

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const EmpID = localStorage.getItem("userID");
//       // console.log("EmpID", EmpID)
//     try {
//       // console.log("EmpID", EmpID)
//       const response = await axios.get(`http://localhost:5500/employee/${EmpID}`);
//       setData(response.data[0]);
//       // console.log("Data", data);
//     } catch (error) {
//       console.error("Error", error);
//     }
//   };

//   fetchData();
//   }, [data]);

//   return (
//     <div className="navbar">
//       <ul className='ul1'>
//         <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
//         <li className='li1'><Link to={'/home-supervisor'}>Home</Link></li>
//         <li style={{ float: 'left', marginLeft: '193px' }} className='li1supervisor'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>

//       </ul>
//       <ul>
//       <li><Link to={'/account-supervisor'} onMouseOver={openModal}>Account</Link></li>
//         <li><Link to={'/request-supervisor'}>Request</Link></li>
//         <li><Link to={'/notification-supervisor'}>Notification</Link></li>
//         <li><Link to={'/terms-supervisor'}>Terms and Conditions</Link></li>
//       </ul>
//       <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
//         {data && (
//           <> 
//         <p>Username: {data.username}</p>
//         <p>Password: {data.password}</p>
//         <p>Position: {data.role_name}</p>
//         {/* <p>Department: {data.department_name}</p> */}
//         </>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default NavbarSuperVisor;
