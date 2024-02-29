import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown'

function Request() {

  const [itemName, setItemName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState({
    amount: '',
  });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState([]);
  const [backCount, setBackCount] = useState('');
  const [item, setItem] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ItemNameTrial, setItemNameTrial] = useState('');
  const [someName, setSomeName] = useState({});
  const [options, setOptions] = useState([]);
  // const [idTaker, setIdTaker] = useState('');


  const Select = {
    width: '43%',
    height: '18%',
    color: 'black',
    border: 'none',
    borderRadius: '21px'
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
    setAmount((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const sendMessage = async () => {

    const get = localStorage.getItem('username');
    const email = localStorage.getItem('email')
    const itemName = item.name
    const categoryName = category.category_name;
    const date = Date.now();

    const response = await axios.get('http://localhost:5500/get-number');
    // console.log("DATA FROM GET ENDPOINT: ,", response.data.latestId + 1);
    // setIdTaker(response.data.latestId);
    // setLatestId(response.data.latestId);

    const  idTaker = response.data.latestId + 1;
    
    // console.log("IDTAKER cyane", idTaker);

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

    console.log("Item name: ", messageData.itemName);
    console.log("Category Name: ", messageData.categoryName)
    console.log("Back Count: ", backCount.totalCount);
    console.log("Front Count: ", amount.amount);

    if (backCount.totalCount < messageData.count) {
      window.alert("Amount requested is not available", Error);
    } else {
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
  } 
  return (
    <div>
      <Navbar></Navbar>
      <div style={kain}>
                <h1>Requisition Tab</h1>
            </div>
      <div className='request-container'>
        <div className='request'>
          <select style={Select} onChange={handleCategoryChange} value={selectedCategory}>
            <option value='' disabled>Select Category</option>
            {category.map(categories => (
              <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
            ))}
          </select>

          <Multiselect options={options} displayValue='name' onSelect={handleSelectedItemName} />

          <input placeholder='Amount Desired ...' type='text' name='amount' onChange={handleAmount} />

          <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Request;
