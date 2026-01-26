import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Step1 from './pages/registration/Step1';
import OnboardingPage from './pages/registration/OnboardingPage';
import NewsfeedDashboard1 from './pages/dashboard/NewsfeedDashboard1';
import GroupsManagement from './pages/dashboard/GroupsManagement';
import AdvancedMemberSearch from './pages/search/AdvancedMemberSearch';
import ChatInterface from './pages/dashboard/ChatInterface';
import UserProfile from './pages/user/UserProfile.jsx';
import MemberProfile from './pages/member/MemberProfile.jsx';
import CreateGroupPage from './pages/dashboard/CreateGroupPage';
import GroupDetailPage from './pages/dashboard/GroupDetailPage';
import EditGroupPage from './pages/dashboard/EditGroupPage';
import Newsfeed from './pages/dashboard/Newsfeed';
import FriendRequests from './pages/dashboard/FriendRequests';
import FriendSuggestions from './pages/dashboard/FriendSuggestions';
import AdminGroupsManager from "./pages/admin-website/AdminGroupsManager.jsx";
import AdminMembersManager from "./pages/admin-website/AdminMembersManager.jsx";
import MainFeedManager from "./pages/admin-website/MainFeedManager.jsx";
import AdminReportsManager from "./pages/admin-website/AdminReportsManager.jsx";
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registration/step-1" element={<Step1 />} />
        <Route path="/onboarding" element={<OnboardingPage />} />  {/* THÊM DÒNG MỚI */}
        <Route path="/dashboard/newsfeed-1" element={<NewsfeedDashboard1 />} />
        <Route path="/dashboard/groups" element={<GroupsManagement />} />
        <Route path="/dashboard/groups/:id" element={<GroupDetailPage />} />
        <Route path="/dashboard/groups/create" element={<CreateGroupPage />} />
        <Route path="/dashboard/groups/edit/:id" element={<EditGroupPage />} />
        <Route path="/dashboard/chat" element={<ChatInterface />} />
        <Route path="/dashboard/my-profile" element={<UserProfile />} />
        <Route path="/dashboard/member/:id" element={<MemberProfile />} />
        <Route path="/dashboard/feed" element={<Newsfeed />} />
        <Route path="/dashboard/requests" element={<FriendRequests />} />
        <Route path="/dashboard/suggestions" element={<FriendSuggestions />} />
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
