import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx';
import Home from './pages/home';
import Terms from './pages/terms';
import Navbar from './pages/navbar';
import Request from './pages/request';
import Account from './pages/account';
import Notification from './pages/notification';

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
