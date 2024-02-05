import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import NavbarHome from './NavbarHome';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown'

function RequestSupervisor() {

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
  const [selectedItem, setSelectedItem] = useState('');
  const [ItemNameTrial , setItemNameTrial] = useState('');
  const [someName, setSomeName] = useState({});
  const [options, setOptions] = useState([]);


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
  
  const sendMessage = () => {

    const get = localStorage.getItem('username');
    const itemName = item.name
    const categoryName = category.category_name;
    const date = Date.now();
    const messageData = {
      employeeName: get,
      categoryName: category[0].category_name,
      itemName: someName.name,
      count: amount.amount,
      description,
      date: formatDate(date),
    };

    console.log("Item name: ", messageData.itemName);
    console.log("Category Name: ", messageData.categoryName)
    console.log("Back Count: ", backCount.totalCount);
    console.log("Front Count: ", amount.amount);

    if (backCount.totalCount < messageData.count) {
      window.alert("Amount requested is not available", Error);
    } else {
      socket.emit("message_from_supervisor_straight_to_HR", messageData);
      window.alert("Request sent To HR For Appproval....");
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
    setItemNameTrial(selectedList.map(item=> setSomeName(item)))
  }
  
  return (
    <div>
      <NavbarHome></NavbarHome>
      <div className='request-supervisor-container'>
        <div className='request-supervisor'>

          <select style={Select} onChange={handleCategoryChange} value={selectedCategory}>
            <option value='' disabled>Select Category</option>
            {category.map(categories => (
              <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
            ))}
          </select>

          <Multiselect  options={options} displayValue='name' onSelect={handleSelectedItemName}/>

          <input placeholder='Amount Desired ...' type='text' name='amount' onChange={handleAmount} />

          <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RequestSupervisor;
