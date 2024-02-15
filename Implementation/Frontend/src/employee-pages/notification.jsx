import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('');

  // const socket = io.connect("http://localhost:5001");

  // socket.on("connect", () => {
  //   console.log("Connected to the server");

  //   socket.on("Approved_By_Either(2)", (MessageData) => {
  //     console.log("Approved Info", MessageData);
  //     setNotifications(MessageData);
  //     const approve = "Approved";
  //     setStatus(status);
  //   });

  //   socket.on("Denied_By_Either(2)", (MessageData, status) => {
  //     console.log("Denied Info", MessageData, status);
  //     setNotifications(MessageData);
  //     const deny = "Denied";
  //     setStatus(deny);
  //   });
  // });

  // socket.on("disconnect", () => {
  //   console.log("Disconnected from socket server");
  // });


  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('userID');
      // console.log("ID", id);
      const response = await axios.get(`http://localhost:5500/get-all-requests/${id}`);
      // const result = response.result;
      setNotifications(response.data)
    }
    fetchData();
  }, [notifications])

  // console.log("Data: ", notifications);



  return (
    <div>
      <Navbar></Navbar>
      <div className="notification-container">

        {/* {notifications.map((notification) => {
          console.log("Data in the div", notification);
          const employeeName = notification.employeeName;
          const itemName = notification.itemName;
          const categoryName = notification.categoryName;
          const description = notification.description;
          const date = notification.date;
          const count = notification.count;

          return (

            <div className="notification" key={notification.id}>
              <span>Your request of {itemName} from {categoryName} category was {status} </span>
            </div>
          )
        })
        } */}


        {/* <span>Your request of {notifications.name} from {notifications.category_name} is {notifications.status} </span> */}

        {notifications.map((notification) => {
          if (!notification) {
            return null; // Skip if notification is undefined
          }
          const itemName = notification.name;
          const categoryName = notification.category_name;
          const status = notification.status;
          const id = notification.id;
          const date = notification.date_of_request
          
          const getColor = (status) => {
            switch (status) {
              case 'Approved':
                return 'green';
              case 'Denied':
                return 'red';
              case 'Pending':
                return 'rgb(50, 120, 177)';
              default:
                return 'black'
            }
          }
          const style = {
            width: '37%',
            height: '8%',
            textAlign: 'center',
            border: 'none',
            display: 'flex',
            // flexDirection: 'in-line',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: getColor(status),
            borderRadius: '15px',
            // padding: '12px 0px',
            color: 'white',
          }

          console.log("Data in the div:  ", notification)

          return (
            <div  style={style} key={id}>
              <span >Your request of {itemName} from {categoryName} requested on {date} is {status}</span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Notification;
