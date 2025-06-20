import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileCard from './components/modules/profile-card/ProfileCard';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileCard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
