import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

function Request() {

  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('')

  const socket = io.connect("http://localhost:5001");

  const sendMessage = () => {

   

    if (!itemName || !amount || !description || !name) {
      console.error('Please fill in all fields');
      return;
    }

    const messageData = {
      name,
      itemName,
      amount,
      description
    };

    socket.emit("send_message", messageData)

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    useEffect(() => {
      axios.get('http://localhost:5500')
        .then(res => {
          if (res.data.valid)
            setName(res.data.username);
        })
        .catch(err => console.log(err))
    }, [])


  };
  return (
    <div className="request-container">
      <form className='request'>
        <h1>Request</h1>
        <input placeholder='Item name' type='text' name='name' value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <input placeholder='Amount' type='text' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
        <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}

export default Request;
