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
import AdminGroupsManager from "./pages/admin-website/AdminGroupsManager.jsx";
import AdminMembersManager from "./pages/admin-website/AdminMembersManager.jsx";
import MainFeedManager from "./pages/admin-website/MainFeedManager.jsx";
import AdminReportsManager from "./pages/admin-website/AdminReportsManager.jsx";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
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
        <Route path="/admin-website/groups" element={<AdminGroupsManager />} />
        <Route path="/admin-website/members" element={<AdminMembersManager />} />
        <Route path="/admin-website/contents" element={<MainFeedManager />} />
        <Route path="/admin-website/reports" element={<AdminReportsManager />} />
      </Routes>
    </>
  );
}

export default App;