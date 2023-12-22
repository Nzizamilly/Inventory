import { Link } from 'react-router-dom';
import React from 'react';

function Notification() {
  return (
    <div className="notification-container">
      <div className="notification notification-success"><span>Admin Approved: POS 2 Date: 12/12/2023</span></div>
      <div className="notification notification-error"><span>Admin Denied: POS 2 Date: 12/12/2023</span></div>
      <div className="notification notification-success"><span>Admin Approved: POS 2 Date: 12/12/2023</span></div>
    </div>
  );
}

export default Notification;
