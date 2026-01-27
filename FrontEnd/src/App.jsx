import {  Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import './App.css';
import LandingPage from './components/LandingPage';
import PlacementDashboard from './components/pages/PlacementDashboard';


function App() {
  return (

    <Routes>
       <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path='/placement_stats' element={<PlacementDashboard/>}/>
       
    </Routes>

  );
}

export default App;
