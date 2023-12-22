import './style.css';
import Login from './pages/login';
import Home from './pages/home';
import Terms from './pages/terms';
import Navbar from './pages/navbar';
import Request from './pages/request';
import Account from './pages/account';
import Notification from './pages/notification';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter >
      <Navbar />
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/notification' element={<Notification/>}/>
          <Route path='/terms' element={<Terms/>}/>
          <Route path='/request' element={<Request/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
