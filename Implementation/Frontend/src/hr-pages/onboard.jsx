import React, { useState, useEffect } from 'react';
import NavbarMain from './navbarMain';
import axios from "axios";
import DataTable from 'react-data-table-component';
import Add from '../images/add.svg'
import Modal from 'react-modal';
import ImgAdd from '../images/add-photo.svg';
import Switch from 'react-switch'
import ClipLoader from "react-spinners/ClipLoader";
import Info from '../images/info.svg'
import ProfilePicture from '../images/profile-picture.svg';
import '../style.css'
import Update from '../images/update.svg';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import keys from '../keys';
import Left from '../images/left-arrow.svg';
import Right from '../images/right-arrow.svg';


function Onboard() {
  const url = keys.REACT_APP_BACKEND;

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '83%',
      margin: 'auto',
      height: '84vh',
      backgroundColor: 'rgb(206, 206, 236)',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      fontFamily: 'Arial, sans- serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const modalUpdate = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '33%',
      marginLeft: '495px',
      height: '90vh',
      backgroundColor: 'rgb(206, 206, 236)',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      fontFamily: 'Arial, sans- serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const ThemBs = {
    display: 'flex',
    gap: '9px',
    flexDirection: 'row'
  }

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const arrows = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const [emps, setEmps] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [switchStates, setSwitchStates] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [department, setDepartment] = useState([]);
  const [role, setRole] = useState([]);
  const [roleUpdate, setRoleUpdate] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUpdatedRole, setSelectedUpdatedRole] = useState('');
  const [oneEmployee, setOneEmployee] = useState(false);
  const [sumOne, setSumOne] = useState([]);
  const [selectedUpdateDepartment, setSelectedUpdateDepartment] = useState('');
  const [update, setUpdate] = useState({
    username: '',
    password: '',
    address: '',
    department: '',
    role: '',
    profile_pricture: '',
    status: '',
    email: ''
  });

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get(`${url}/employees`);
        setEmps(res.data);
      } catch (error) {
      }
    };
    fetchEmp();
  }, []);;


  const handleSwitchChange = async (checked, empID) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [empID]: checked,
    }));

    const status = checked ? 'ACTIVE' : 'DE-ACTIVATED';

    try {
      console.log("Emp ID: ", empID);
      const response = await axios.put(`${url}/deactivate-employee/${empID}`, {
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

  };

  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };


  useEffect(() => {
    setUpdate(prevUpdate => ({
      ...prevUpdate,
      roleName: selectedUpdatedRole,
      departmentName: selectedUpdateDepartment,
    }))
  }, [selectedUpdatedRole, selectedUpdateDepartment])

  const handleUpdate = async (EmpID) => {
    console.log("SELECTED EMPLOYEE ID: ", EmpID);
    try {
      await axios.put(`${url}/employee/${EmpID}`, update);
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


  const bringOneEmployee = async (id) => {
    try {
      const response = await axios.get(`${url}/employee-once/${id}`);
      setSumOne(response.data);
    } catch (error) {
      console.error("Error: ", error);
    }

  }

  const openInfoModal = (id) => {
    bringOneEmployee(id);
    fetchImageURL(id)
    setOneEmployee(true);
  };

  const closeInfoModal = () => {
    setOneEmployee(false);
  };

  const empsColumn = [
    {
      name: 'Name',
      selector: row => row.username
    },

    {
      name: 'Role',
      selector: row => row.role_name
    },
    {
      name: 'View',
      cell: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id)}><img src={Info} style={svgStyle} /></button>
      )
    },
  ];

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
  };

  useEffect(() => {
    const getDept = async () => {
      const response = await axios.get(`${url}/get-department/`);
      setDepartment(response.data);
    };
    getDept()
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for Department", typeof selectedValue);
    setSelectedDepartment(selectedValue);
  }

  const handleUpdateDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for Department", typeof selectedValue);
    setSelectedUpdateDepartment(selectedValue);
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
      const response = await axios.get(`${url}/get-role/${selectedDepartment}`);
      setRole(response.data);
      console.log("DATA: ", response.data)
    }
    if (selectedDepartment) {
      fetchRole(selectedDepartment);
    }
  }, [selectedDepartment])

  useEffect(() => {
    const fetchRole = async (selectedUpdateDepartment) => {
      const response = await axios.get(`${url}/get-role/${selectedUpdateDepartment}`);
      setRoleUpdate(response.data);
      console.log("DATA: ", response.data)
    }
    if (selectedUpdateDepartment) {
      fetchRole(selectedUpdateDepartment);
    }
  }, [selectedUpdateDepartment])

  const handleRoleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for role", typeof selectedValue);
    setSelectedRole(selectedValue);
  };

  const handleUpdateRoleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for role", typeof selectedValue);
    setSelectedUpdatedRole(selectedValue);
  };

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
    address: '',
    departmentName: '',
    roleName: '',
    email: '',
    date_of_employment: ''
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
      const response = await axios.post(`${url}/employee`, employee);
      const newEmployeeID = response.data;

      if (imageUpload == null) return;
      const IdForQuotation = newEmployeeID;
      console.log("ID FOR QUOTATION: ", IdForQuotation);
      const imageRef = ref(storage, `employeesProfilePictures/${imageUpload.name, IdForQuotation}`);
      uploadBytes(imageRef, imageUpload).then(() => {
      });

      setInterval(() => {
        closeCreateModal();
      }, 2700);

      setAddVisible(false);

    } catch (error) {
      console.log('Error', error)
    };
  };

  const Kaine = {
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)'
  };

  const MakeBig = {
    width: '90%',
    marginLeft: '15%'
  };

  const One = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'inline',
    gap: '12px'
  };

  const updateFileName = (event) => {
    const selectedFile = event.target.files[0];
    setImageUpload(event.target.files[0]);
    const fileName = selectedFile ? selectedFile.name : 'No file Chosen';
    setFile(fileName);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile)
    };
  };

  const [createModal, setCreateModal] = useState(false);

  const openCreateModal = () => {
    setCreateModal(true);
    handleMake();
  };

  const closeCreateModal = () => {
    setCreateModal(false);
  };

  const fetchImageURL = async (ID) => {
    try {
      if (ID) {
        console.log("ID PROVIDED: ", ID)
        const imageRef = ref(storage, `employeesProfilePictures/${ID}`);
        const imageURL = await getDownloadURL(imageRef);
        setImageURL(imageURL);
      };
    } catch (error) {
      if (error) {
        setImageURL('');
        console.error("Error: ", error);
      }
    };
  };

  const [trial, setTrial] = useState('');

  useEffect(() => {
    const functions = () => {
      try {
        const sumn = 'sumn';
        setTrial(sumn);
      } catch (error) {
        console.error("Error: ", error);
      };
    };
    functions();
  }, []);

  const style = {
    backgroundColor: 'black',
    width: '1%',
    height: '1%'
  };

  const [records, setRecords] = useState([]);

  const handleFilter = (event) => {
    const newData = emps.filter((row) => {
      return row.username.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  useEffect(() => {
    setRecords(emps);
  }, [emps]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const holder = {
    width: '80%',
    height: '85%',
    borderRadius: '12px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // position: 'relative',
    // animation: 'slideIn 1s ease-out forwards',
    // overflow: 'hidden',
    height: '400px'
  };

  const buttx = {
    width: '40%',
    height: '60px',
    display: 'flex',
    borderRadius: '30px',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const text = {
    width: '60%',
    height: '15%',
    border: 'none',
    borderBottom: '4px solid rgb(16, 232, 106)',
    color: 'black',
    outline: 'none',
    backgroundColor: 'white',
  }

  const [tab, setTab] = useState(1);
  const [animationClass, setAnimationClass] = useState('');
  const [attendantfirstName, setAttendantFirstName] = useState('');
  const [attendantSecondName, setAttendantSecondName] = useState('');
  const [attendantThirdName, setAttendantThirdName] = useState('');
  const [attendantaddress, setAttendantAddress] = useState('');
  const [attendantPhoneNumber, setAttendantPhoneNumber] = useState('')
  const [attendantNationality, setAttendantNationality] = useState('')
  const [attendantEmail, setAttendantEmail] = useState('')
  const [attendantBirthDate, setAttendantBirthDate] = useState('')
  const [attendantHeight, setAttendantHeight] = useState('');
  const [attendantPassportNumber, setAttendantPassportNumber] = useState('');
   











  const numberOfTabs = 9;

  const handlePrev = () => {
    setAnimationClass('slide-left');
    setTab((prev) => (prev > 1 ? prev - 1 : numberOfTabs));
  };

  const handleNext = () => {
    setAnimationClass('slide-right');
    setTab((prev) => (prev < numberOfTabs ? prev + 1 : 1));
  };

  // Reset animation class to allow re-triggering
  const resetAnimation = () => {
    setAnimationClass('');
  };

  return (
    <div>
      <NavbarMain></NavbarMain>
      <div style={Kaine}>
        <div style={kain}>
          <div style={MakeBig}>
            <div style={One}>
              <h1>List OF Employees</h1>
              <button className='addItem-btn1' onClick={() => setAddVisible(true)} ><img src={Add} style={svgStyle} /></button>
              <input type='text' placeholder='Search For An Employee' onChange={handleFilter} />
            </div>
            <DataTable
              columns={empsColumn}
              data={records}
              pagination
            ></DataTable>
          </div>

        </div>

        <br />

        <div style={some}>
          <Modal isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
            <div
              className={animationClass}
              style={holder}
              onAnimationEnd={resetAnimation} // Reset animation class after animation ends
            >
              {tab === 1 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Personal Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setAttendantFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' onChange={(e) => setAttendantSecondName(e.target.value)}/>
                      <input placeholder='Third Name' style={text} type='text' onChange={(e) => setAttendantThirdName(e.target.value)}/>
                      <input placeholder='Phone (Drop)' style={text} type='text' onChange={(e) => setAttendantPhoneNumber(e.target.value)} />
                      <input placeholder='Nationality' style={text} type='text' onChange={(e) => setAttendantNationality(e.target.value)}/>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Email' style={text} type='text' onChange={(e) => setAttendantEmail(e.target.value)}/>
                      <input placeholder='Address' style={text} type='text' onChange={(e) => setAttendantAddress(e.target.value)} />
                      <input placeholder='Birth Date' style={text} type='text' onChange={(e) => setAttendantBirthDate(e.target.value)}/>
                      <input placeholder='Phone Number' style={text} type='text' onChange={(e) => setAttendantFirstName(e.target.value)}/>
                      <input placeholder='Height' style={text} type='text' onChange={(e) => setAttendantHeight(e.target.value)}/>
                    </div>
                  </div>

                </div>
              }
              {tab === 2 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Personal Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Passport Number' style={text} type='text' onChange={(e) => setAttendantPassportNumber(e.target.value)} />
                      <input placeholder='Driving License ID' style={text} type='text' />
                      <input placeholder='Tax Identification ID' style={text} type='text' />
                      <input placeholder='Employment Status' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Department' style={text} type='text' />
                      <input placeholder='Position' style={text} type='text' />
                      <input placeholder='Disability' style={text} type='text' />
                      <input placeholder='Marital Status' style={text} type='text' />
                    </div>
                  </div>

                </div>

              }

              {tab === 3 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Spouse Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' />
                      <input placeholder='Third Name' style={text} type='text' />
                      <input placeholder='Phone Number' style={text} type='text' />
                      <input placeholder='Date Of Birth' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Email' style={text} type='text' />
                      <input placeholder='Occupation' style={text} type='text' />
                      <input placeholder='Address' style={text} type='text' />
                      <input placeholder='Number of Children' style={text} type='text' />
                    </div>
                  </div>

                </div>
              }
              {tab === 4 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Family Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Father First Name' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Father Second Name' style={text} type='text' />
                      <input placeholder='Father Third Name' style={text} type='text' />
                      <input placeholder='Father Phone Number' style={text} type='text' />
                      <input placeholder='Father Date Of Birth' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Mother First Name' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Mother Second Name' style={text} type='text' />
                      <input placeholder='Mother Third Name' style={text} type='text' />
                      <input placeholder='Mother Phone Number' style={text} type='text' />
                      <input placeholder='Mother Date Of Birth' style={text} type='text' />
                    </div>
                  </div>

                </div>
              }

              {tab === 5 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Emergency Contact Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' />
                      <input placeholder='Third Name' style={text} type='text' />
                      <input placeholder='Phone Number' style={text} type='text' />
                      <input placeholder='Email' style={text} type='text' />
                    </div>

                  </div>

                </div>
              }

              {tab === 6 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Academic And Professional Qualifications</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Academic Qualification' style={text} type='text' />
                      <input placeholder='Academic Qualification' style={text} type='text' />
                      <input placeholder='Academic Qualification' style={text} type='text' />
                      <input placeholder='Academic Qualification' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '55%', gap: '25px' }}>
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Institution' style={text} type='text' />
                      <input placeholder='Institution' style={text} type='text' />
                      <input placeholder='Institution' style={text} type='text' />
                      <input placeholder='Institution' style={text} type='text' />
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Date Obtained' style={text} type='text' />
                      <input placeholder='Date Obtained' style={text} type='text' />
                      <input placeholder='Date Obtained' style={text} type='text' />
                      <input placeholder='Date Obtained' style={text} type='text' />
                    </div>
                  </div>

                </div>
              }

              {tab === 7 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Employment History</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>
                        Are any of your relatives, family friends or close friends employed by your current employer?
                        if Yes, indicate
                      </p>

                      <input placeholder='Name' style={text} type='text' />
                      <input placeholder='Relationship' style={text} type='text' />
                      <input placeholder='Department' style={text} type='text' />
                      <input placeholder='Branch' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Latest Organization' style={text} type='text' />
                      <input placeholder='Job Title' style={text} type='text' />
                      <input placeholder='From Date' style={text} type='text' />
                      <input placeholder='Company Name' style={text} type='text' />
                      <input placeholder='Phone Number' style={text} type='text' />
                    </div>
                  </div>

                </div>
              }
              {tab === 8 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Employment History</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline', gap: '20px' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>
                        Have you ever been arrested / detained / deported by any Police / Military / Authority either in Rwanda or abroad?
                        if Yes State why
                      </p>

                      <textarea placeholder='Reason' style={text} type='text'></textarea>
                      <p>Have you ever been discharged or been forced to resign for misconduct or unsatisfactory service from any position?
                        If yes say why
                      </p>
                      <textarea placeholder='Reason' style={text} type='text' ></textarea>

                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>Address Reason For Leaving</p>
                      <textarea placeholder='Reason' style={text} type='text' ></textarea>

                    </div>
                  </div>

                </div>
              }

              {tab === 9 &&
                <div style={holder}>
                  <div style={{ width: '100%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Final Statement</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Full Name' style={text} type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      <input placeholder='Address' style={text} type='text' value={address} />
                      <input placeholder='Contact' style={text} type='text' value={phoneNumber} />
                      <input placeholder='Place Of Work' style={text} type='text' />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                    <label  className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Add ID Picture</p>
                    <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName}/>
                    </label>
                    <label  className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Add CV</p>
                    <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName}/>
                    </label>
                    <label  className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Other Docs</p>
                    <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName}/>
                    </label>

                    </div>

                  </div>

                </div>
              }

            </div>


            <div style={{ width: '100%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', flexDirection: 'inline', gap: '12px', }}>
              <div style={{ width: '20%', marginTop: '20px', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px', marginLeft: '297px' }}>
                Slide {tab} of {numberOfTabs}
              </div>
              <div style={{ width: '20%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px', marginLeft: '297px' }}>
                <button style={buttx} onClick={handlePrev}><img src={Left} style={arrows} /></button>
                <button style={buttx} onClick={handleNext}><img src={Right} style={arrows} /></button>
              </div>
            </div>
          </Modal >

          <Modal isOpen={oneEmployee} onRequestClose={closeInfoModal} style={modal}>
            {sumOne.map((emp) => (
              <div key={emp.id} className="employee">
                <h1>{emp.username}</h1>

                {imageURL ? (
                  <img src={imageURL} style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }} />

                ) : <img src={ProfilePicture} style={{ maxWidth: '90%', maxHeight: '15vh', borderRadius: '60px' }} />}

                <p>Username: {emp.username}</p>
                <p>Password: *******</p>
                <p>Address: {emp.address}</p>
                <p>Position: {emp.role_name}</p>
                <p>Department: {emp.department_name}</p>
                <p>Email: {emp.email}</p>
                <p>Date Of Employment: {formatDate(emp.date_of_employment)}</p>
                <p>Status:  <span style={{ color: emp.status === 'DE-ACTIVATED' ? 'red' : 'green' }}>{emp.status}</span></p>
                <div style={ThemBs}>
                  <button className='addItem-btn' onClick={() => setVisible(true)}><img src={Update} style={svgStyle} /></button>
                  <Switch onChange={(checked) => handleSwitchChange(checked, emp.id)} checked={switchStates[emp.id] || false} />
                </div>

                <Modal isOpen={visible} onRequestClose={() => setVisible(false)} style={modalUpdate}>
                  <h1>Update</h1>
                  <input type='text' placeholder='Username' name="username" onChange={handleChange} />
                  <input type='text' placeholder='Password' name="password" onChange={handleChange} />
                  <input type='text' placeholder='Address eg: Kigali - Kicukiro' name="address" onChange={handleChange} />
                  <select onChange={handleUpdateDepartmentChange} value={selectedUpdateDepartment} style={Select}>
                    <option value='' disabled >Select Department</option>
                    {department.map(departments => (
                      <option key={departments.id} value={departments.id} >{departments.department_name}</option>
                    ))}
                  </select>

                  <select onChange={handleUpdateRoleChange} value={selectedUpdatedRole} style={Select}>
                    <option value='' disabled>Select Role</option>
                    {roleUpdate.map(roles => (
                      <option key={roles.id} value={roles.id} style={OptionColor}>{roles.role_name}</option>
                    ))}
                  </select>
                  <input type='email' placeholder='Work-related Email' name='email' onChange={handleChange} />

                  <div style={{ color: 'black', display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
                    <p>Attach New Picture ID (Not required)</p>
                    <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
                      <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                      {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
                    </label>
                  </div>
                  <button onClick={() => handleUpdate(emp.id)}>Submit</button>
                </Modal>
              </div>
            ))}
          </Modal>

          <Modal isOpen={createModal} onRequestClose={closeCreateModal} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
              <ClipLoader color={'green'} loading={loading} size={89} />
              <div>
                <p>Creating An Employee...</p>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
}

export default Onboard;
