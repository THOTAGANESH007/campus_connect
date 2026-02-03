import { Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import './App.css';
import LandingPage from './components/LandingPage';
import PlacementDashboard from './components/pages/PlacementDashboard';
import DriveList from './components/drive/DriveList';
import CreateDrive from './components/drive/CreateDrive';
import DriveDetails from './components/drive/DriveDetails';
import EditDrive from './components/drive/EditDrive';
import ChatInterface from './components/chat/ChatInterface';


function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path='/placement_stats' element={<PlacementDashboard />} />
      <Route path='/drives' element={<DriveList />} />
      <Route path='/drives/create' element={<CreateDrive />} />
      <Route path='/drives/:id' element={<DriveDetails />} />
      <Route path='/drives/:id/edit' element={<EditDrive />} />
      <Route path='/chat' element={<ChatInterface />} />
    </Routes>

  );
}

export default App;
