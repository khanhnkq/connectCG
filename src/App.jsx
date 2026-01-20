import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Step1 from './pages/registration/Step1';
import Step2 from './pages/registration/Step2';
import NewsfeedDashboard1 from './pages/dashboard/NewsfeedDashboard1';
import GroupsManagement from './pages/dashboard/GroupsManagement';
import AdvancedMemberSearch from './pages/search/AdvancedMemberSearch';
import ChatInterface from './pages/dashboard/ChatInterface';
import UserProfile from './pages/dashboard/UserProfile';
import Newsfeed from './pages/dashboard/Newsfeed';
import FriendRequests from './pages/dashboard/FriendRequests';
import MemberProfile from './pages/dashboard/MemberProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/registration/step-1" element={<Step1 />} />
      <Route path="/registration/step-2" element={<Step2 />} />
      <Route path="/dashboard/newsfeed-1" element={<NewsfeedDashboard1 />} />
      <Route path="/dashboard/groups" element={<GroupsManagement />} />
      <Route path="/dashboard/chat" element={<ChatInterface />} />
      <Route path="/dashboard/profile/public" element={<UserProfile />} />
      <Route path="/dashboard/feed" element={<Newsfeed />} />
      <Route path="/dashboard/requests" element={<FriendRequests />} />
      <Route path="/dashboard/profile/view" element={<MemberProfile />} />
      <Route path="/search/members" element={<AdvancedMemberSearch />} />
    </Routes>
  );
}

export default App;
