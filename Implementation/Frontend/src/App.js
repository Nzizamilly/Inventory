import React from 'react';
import './style.css';
import Modal from 'react-modal'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './employee-pages/login.jsx';
import Home from './employee-pages/home';
import Terms from './employee-pages/terms';
import Navbar from './employee-pages/navbar';
import Request from './employee-pages/request';
import Account from './employee-pages/account';
import Notification from './employee-pages/notification';

Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
        </Routes>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/request" element={<Request />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
