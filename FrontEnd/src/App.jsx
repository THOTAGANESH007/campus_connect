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
import InterviewQuestionList from './components/interview/InterviewQuestionList';
import CreateInterviewQuestion from './components/interview/CreateInterviewQuestion';
import InterviewQuestionDetail from './components/interview/InterviewQuestionDetail';
import PlacementMaterialList from './components/placement/PlacementMaterialList';
import ShareMaterialForm from './components/placement/ShareMaterialForm';

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
      {/* Interview Questions Module */}
      <Route path='/interview-questions' element={<InterviewQuestionList />} />
      <Route path='/interview-questions/create' element={<CreateInterviewQuestion />} />
      <Route path='/interview-questions/:id' element={<InterviewQuestionDetail />} />
      {/* Placement Materials Module */}
      <Route path='/placement-materials' element={<PlacementMaterialList />} />
      <Route path='/placement-materials/share' element={<ShareMaterialForm />} />
    </Routes>
  );
}

export default App;
