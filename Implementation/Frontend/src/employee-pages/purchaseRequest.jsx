import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import ImgAdd from '../images/add-photo.svg';
import Select from 'react-select';
import Modal from 'react-modal'

function PurchaseRequest() {


  const [description, setDescription] = useState('');
  const [endGoalValue, setEndGoalValue] = useState('');
  const [category, setCategory] = useState([]);
  const [backCount, setBackCount] = useState('');
  const [item, setItem] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ItemNameTrial, setItemNameTrial] = useState('');
  const [someName, setSomeName] = useState({});
  const [options, setOptions] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState([]);


  const Selects = {
    width: '43%',
    height: '18%',
    color: 'black',
    border: 'none',
    borderRadius: '21px'
  };

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
      backgroundColor: 'rgb(79, 79, 83)',
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
  };

  const Option = {
    width: '39%',
    height: '25%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  }

  const socket = io.connect("http://localhost:5001");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5500/category`);
        setCategory(res.data);
      } catch (error) {
        console.error("Error: ", error)
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchItem = async (categoryID) => {
      console.log("CategoryID: ", categoryID);
      try {
        const response = await axios.get(`http://localhost:5500/items/${categoryID}`);
        setItem(response.data);
        setOptions(response.data);

      } catch (error) {
        console.error("Error: ", error);
      }
    }
    if (selectedCategory) {
      fetchItem(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  }

  useEffect(() => {
    const fetchCount = async (itemID) => {
      try {
        const itemId = itemID;
        const response = await axios.get(`http://localhost:5500/get-total-number/${itemId}`);
        setBackCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    if (someName.id) {
      fetchCount(someName.id);
    }
  }, [someName]);

  const handleAmount = (event) => {
    setAmount(event.target.name);
  };

  const sendMessage = async () => {

    const get = localStorage.getItem('username');
    const email = localStorage.getItem('email')

    const date = Date.now();

    const response = await axios.get('http://localhost:5500/get-number');

    const idTaker = response.data.latestId + 1;

    const messageData = {
      id: idTaker,
      employeeName: get,
      categoryName: category[0].category_name,
      itemName: someName.name,
      count: amount.amount,
      description,
      email: email,
      date: formatDate(date),

    };

    messageData.priority = selectedPriority;

    // console.log("Item name: ", messageData.itemName);
    // console.log("Category Name: ", messageData.categoryName)
    // console.log("Back Count: ", backCount.totalCount);
    // console.log("Front Count: ", amount.amount);
    console.log("SelectedPriority", selectedPriority);
    console.log("MessageData Data: ", messageData);


    window.alert("Request sent....");
    socket.emit("Employee_Message_Supervisor(1)", messageData);
    try {
      const response = await axios.post('http://localhost:5500/add-request-employee-supervisor', messageData);
      messageData.id = id;
      const id = response.id;
      console.log("Response", response);
    } catch (error) {
      console.error("Error Occurred Unexpectedly", error)
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })
  };

  const requestContainer = {
    fontFamily: 'Arial sansSerif',
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(34, 41, 44)',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSelectedItemName = (selectedList, selectedItem) => {
    setItemNameTrial(selectedList.map(item => setSomeName(item)))
  }
  const kain = {
    marginLeft: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(34, 41, 44)',
    paddingTop: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'rgb(219, 215, 215)'
  };

  const sumStyle = {
    display: 'flex',
    flexDirection: 'inline',
    gap: '12px',
    width: '60%',
    height: '33%'
  }

  const option = [
    { value: 'red', label: <img src={Red} alt="Red" style={{ width: '24px', height: '24px' }} /> },
    { value: 'green', label: <img src={Green} alt="Green" style={{ width: '24px', height: '24px' }} /> },
    { value: 'cyan', label: <img src={Cyan} alt="Cyan" style={{ width: '24px', height: '24px' }} /> }
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 170,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'lightgrey'
      }

    }),
    singleValue: (provided) => ({
      ...provided,
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black'
    })
  };

  const [supervisorId, setSupervisorId] = useState([]);


  const handlePriorityChange = (event) => {
    setSelectedPriority(event.value);
  };

  useEffect(() => {
    const showSupervisor = async () => {
      try {
        const response = await axios.get("http://localhost:5500/show-supervisor");
        console.log("Data: ", response.data);
        setSupervisorId(response.data);
      } catch (error) {
        console.error("Error: ", error);
      };
    }
    showSupervisor();
  }, []);

  const supervisor = supervisorId.map((supervisor) => ({
    value: supervisor.id,
    label: supervisor.username
  }));

  const customStyle = {
    control: (provided) => ({
      ...provided,
      width: 190,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'lightgrey'
      }

    }),
    singleValue: (provided) => ({
      ...provided,
      width: '54px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
    })
  };

  const handleSupervisorChange = (event) => {
    setSelectedSupervisor(event.value);
  };

  const [file, setFile] = useState('');

  const updateFileName = (event) => {
    const fileName = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
    setFile(fileName);
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  }


  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  }

  const [cost, setCost] = useState('');

  const handleCost = (event) => {
    setCost(event.target.value);
  };

  const employeeName = localStorage.getItem('username');
  const employeeID = localStorage.getItem('userID');

  const messageForDown = [
    employeeName,
    description,
    amount,
    cost,
    supervisor,
    endGoalValue,
    file
  ];

useEffect(() => {
  const append = (messageForDown) => {
    setMessage(messageForDown);
  }
  append(messageForDown)
},[message])


  console.log("MessageData For Down: ", messageForDown );

  return (
    <div>
      <Navbar></Navbar>
      <div style={kain}>
        <h1>Expenditure Request Tab</h1>
      </div>
      <div className='request-container'>
        <div className='request'>
          <textarea style={{ height: '20%', border: 'none' }} required name='description' placeholder='Expenditure Line...' value={description} onChange={(e) => setDescription(e.target.value)} >Expenditure Line...</textarea>
          <div style={{ width: '95%', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <input type='text' id='amount_purchase' placeholder='Amount' name='amount' onChange={handleAmount} />
            <div>
              <p>Once-Off cost: <input type='radio' name='cost' value='once-off' onChange={handleCost} /> </p>
              <p>Ongoing cost: <input type='radio' name='cost' value='ongoing' onChange={handleCost} /> </p>
            </div>
          </div>
          <Select
            options={supervisor}
            styles={customStyle}
            placeholder="Select Supervisor"
            onChange={handleSupervisorChange}
          />
          <textarea style={{ height: '20%', border: 'none' }} required name='end_goal' placeholder='End Goal...' value={endGoalValue} onChange={(e) => setEndGoalValue(e.target.value)} ></textarea>
          <div style={{ display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
            <p>Attach Parforma (Not required)</p>
            <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
              <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
              {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
            </label>
          </div>

          <button onClick={openReviewModal}>Review</button>
          <Modal isOpen={isReviewModalOpen} onRequestClose={closeReviewModal} style={modal} >
            {message.map((messages) => (
              <div>
                <p>{messages.employeeName}</p>
                <p>{messages.description}</p>
                <p>{messages.amount}</p>
                <p>{messages.cost}</p>
                <p>{messages.supervisor}</p>
                <p>{messages.endGoalValue}</p>
                <p>{messages.file}</p>
              </div>
            ))}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequest;
