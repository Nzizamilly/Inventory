import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

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
  const [selectedItem, setSelectedItem] = useState('');

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

  const handleItemChange = (event) => {
    const selectedItemValue = event.target.value;
    setSelectedItem(selectedItemValue);
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
    if (selectedItem) {
      fetchCount(selectedItem);
    }
  }, [selectedItem]);

  const handleAmount = (event) => {
    setAmount((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // if (item.length > 0 && 'name' in item[0]) {
  //   console.log("Item Object: ", item[0].name);
  // } else {
  //   console.log("Item array is empty or does not have a 'name' property.");
  // }
  
  const sendMessage = () => {

    // if (!itemName || !amount || !description) {
    //   console.error('Please fill in all fields');
    //   return;
    // }
    const get = localStorage.getItem('username');
    const itemName = item.name
    const categoryName = category.category_name;
    const date = Date.now(); 
    const messageData = {
      employeeName: get,
      categoryName: category[0].category_name,
      itemName: item[0].name,
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
      socket.emit("send_message", messageData);
      window.alert("Request sent....");
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
 
  return (
    <div className='request-container'>
    <div className='request'>
     
      <select style={Select} onChange={handleCategoryChange} value={selectedCategory}>
        <option value='' disabled>Select Category</option>
        {category.map(categories => (
          <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
        ))}
      </select>

      <select style={Select} onChange={handleItemChange} value={selectedItem}>
        <option value='' disabled>Select Item From Category Provided</option>
        {item.map(items => {
          return <option key={items.id} value={items.id} style={Option}>{items.name}</option>
        })}
      </select>

      <input placeholder='Amount Desired ...' type='text' name='amount' onChange={handleAmount} />

      <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);
};

export default Request;

































