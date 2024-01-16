import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

function Request() {

  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [show, setShow] = useState('');
  const [name, setName] = useState('')

  const socket = io.connect("http://localhost:5001");

  const sendMessage = () => {

    if (!itemName || !amount || !description ) {
      console.error('Please fill in all fields');
      return;
    }
    const get = localStorage.getItem('username');
    
    setName(get);

    console.log('name', name)
    const messageData = {
      employeeName: get,
      itemName,
      amount,
      description
    };

   console.log("name", messageData.employeeName);

    socket.emit("send_message", messageData);

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })
  };
  return (
    <div className="request-container">
      <form className='request'>
        <h1>{show.itemName}</h1>
        <input placeholder='Item name' type='text' name='name' value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <input placeholder='Amount' type='text' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
        <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}

export default Request;
