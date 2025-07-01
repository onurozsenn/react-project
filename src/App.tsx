import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup'; 
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './components/modules/profile-card/ProfileCard'; 
import DashboardLayout from './components/layout/DashboardLayout';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    // Hatanın çözümü için BrowserRouter'ı tekrar buraya ekliyoruz.
    // Artık <Routes> bileşeni, hangi adrese bakacağını biliyor.
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Ana Layout'u kullanan sayfalar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
