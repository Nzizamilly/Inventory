import React from 'react';
import './style.css';
import Modal from 'react-modal'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './employee-pages/login.jsx';
import Home from './employee-pages/home.jsx';
import Terms from './employee-pages/terms';
import Navbar from './employee-pages/navbar';
import Request from './employee-pages/request';
import Account from './employee-pages/account';
import Notification from './employee-pages/notification';
import CategoryAdmin from './admin-pages/category-admin.jsx';
import EmployeesAdmin from './admin-pages/employees-admin.jsx';
import ItemsAdmin from './admin-pages/items-admin.jsx';
import NotificationAdmin from './admin-pages/notification-admin.jsx';
import SupplierAdmin from './admin-pages/suppliers-admin.jsx';
import AccountAdmin from './admin-pages/Account.jsx';
import NavbarAdmin from './admin-pages/navbarAdmin.jsx';
import TermsAdmin from './admin-pages/terms.jsx';
import TransactionAdmin from './admin-pages/transactions.jsx';

Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <NavbarAdmin />
        <Routes>
          <Route path="/account-admin" element={<AccountAdmin />} />
          <Route path="/notification-admin" element={<NotificationAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/supplier-admin" element={<SupplierAdmin />} />
          <Route path="/category-admin" element={<CategoryAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/employees-admin" element={<EmployeesAdmin />} />
          <Route path="/terms-admin" element={<TermsAdmin />} />
          <Route path="/transaction-admin" element={<TransactionAdmin />} />
        </Routes>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home-employee" element={<Home />} />
          <Route path="/account-employee" element={<Account />} />
          <Route path="/notification-employee" element={<Notification />} />
          <Route path="/terms-employee" element={<Terms />} />
          <Route path="/request-employee" element={<Request />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
