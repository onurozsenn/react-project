import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileCard from './components/modules/profile-card/ProfileCard';
import DashboardLayout from './components/layout/DashboardLayout';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileCard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
