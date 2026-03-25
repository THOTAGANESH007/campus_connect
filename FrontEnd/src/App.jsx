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
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentProfile from './components/profile/StudentProfile';
import MyApplications from './components/applications/MyApplications';
import SavedItems from './components/bookmarks/SavedItems';
import ForumPage from './components/forum/ForumPage';
import CreatePost from './components/forum/CreatePost';
import PostDetail from './components/forum/PostDetail';
import ResumeAnalyzer from './components/resume/ResumeAnalyzer';

const OFFICER_ADMIN = ['ADMIN', 'PLACEMENT_OFFICER'];

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Protected – any logged-in user */}
      <Route path='/placement_stats' element={<ProtectedRoute><PlacementDashboard /></ProtectedRoute>} />
      <Route path='/drives' element={<ProtectedRoute><DriveList /></ProtectedRoute>} />
      <Route path='/drives/:id' element={<ProtectedRoute><DriveDetails /></ProtectedRoute>} />
      <Route path='/chat' element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
      <Route path='/interview-questions' element={<ProtectedRoute><InterviewQuestionList /></ProtectedRoute>} />
      <Route path='/interview-questions/:id' element={<ProtectedRoute><InterviewQuestionDetail /></ProtectedRoute>} />
      <Route path='/placement-materials' element={<ProtectedRoute><PlacementMaterialList /></ProtectedRoute>} />

      {/* Student features */}
      <Route path='/profile' element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
      <Route path='/my-applications' element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
      <Route path='/saved' element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
      <Route path='/forum' element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
      <Route path='/forum/create' element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path='/forum/:id' element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />

      {/* Officer/Admin only */}
      <Route path='/drives/create' element={<ProtectedRoute roles={OFFICER_ADMIN}><CreateDrive /></ProtectedRoute>} />
      <Route path='/drives/:id/edit' element={<ProtectedRoute roles={OFFICER_ADMIN}><EditDrive /></ProtectedRoute>} />
      <Route path='/interview-questions/create' element={<ProtectedRoute><CreateInterviewQuestion /></ProtectedRoute>} />
      <Route path='/placement-materials/share' element={<ProtectedRoute><ShareMaterialForm /></ProtectedRoute>} />
      <Route path='/resume-analyzer' element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
