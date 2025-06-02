import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup';
import { JSX } from 'react';
import Dashboard from './pages/dashboard/Dashboard';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
