import { Link } from 'react-router-dom';
import React from 'react';
import io from 'socket.io-client'


function Request() {
  const socket = io.connect("http://localhost:5500");
  const sendMessage = () => {
    socket.on("connect", () => {
      console.log("Connected to socket io server")
    });

    socket.emit("send_message", { message: "Hello" })
    
    socket.on("disconnect", ()=>{
      console.log("Disconnected from socket server")
    })

  };
  return (
    <div className="request-container">
      <form className='request'>
        <h1>Request</h1>
        <input placeholder='Item name' type='text' name='name' />
        <input placeholder='Amount' type='text' name='amount' />
        <textarea name='description'>Description</textarea>
        <Link to={'/'}><button onClick={sendMessage}>Send</button></Link>
      </form>
    </div>
  );
}

export default Request;
