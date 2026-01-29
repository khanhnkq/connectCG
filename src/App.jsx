import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./context/WebSocketContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Step1 from "./pages/registration/Step1";
import OnboardingPage from "./pages/registration/OnboardingPage";
import NewsfeedDashboard1 from "./pages/dashboard/NewsfeedDashboard1";
import GroupsManagement from "./pages/dashboard/GroupsManagement";
import AdvancedMemberSearch from "./pages/search/AdvancedMemberSearch";
import ChatInterface from "./pages/dashboard/ChatInterface";
import UserProfile from "./pages/user/UserProfile.jsx";
import MemberProfile from "./pages/member/MemberProfile.jsx";
import CreateGroupPage from "./pages/dashboard/CreateGroupPage";
import GroupDetailPage from "./pages/dashboard/GroupDetailPage";
import EditGroupPage from "./pages/dashboard/EditGroupPage";
import Newsfeed from "./pages/dashboard/Newsfeed";
import FriendRequests from "./pages/dashboard/FriendRequests";
import FriendSuggestions from "./pages/dashboard/FriendSuggestions";
import FriendsSearch from "./pages/dashboard/FriendsSearch";
import AdminGroupsManager from "./pages/admin-website/AdminGroupsManager.jsx";
import AdminMembersManager from "./pages/admin-website/AdminMembersManager.jsx";
import MainFeedManager from "./pages/admin-website/MainFeedManager.jsx";
import AdminReportsManager from "./pages/admin-website/AdminReportsManager.jsx";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import OAuth2RedirectHandler from "./pages/auth/OAuth2RedirectHandler";
import TermsOfService from "./pages/auth/TermsOfService";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <WebSocketProvider>
        <Routes>
          {/* Guest Routes - Redirect to Dashboard if already logged in */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/registration/step-1" element={<Step1 />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Protected Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="newsfeed-1" element={<NewsfeedDashboard1 />} />
            <Route path="groups" element={<GroupsManagement />} />
            <Route path="groups/:id" element={<GroupDetailPage />} />
            <Route path="groups/create" element={<CreateGroupPage />} />
            <Route path="groups/edit/:id" element={<EditGroupPage />} />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="my-profile" element={<UserProfile />} />
            <Route path="member/:id" element={<MemberProfile />} />
            <Route path="feed" element={<Newsfeed />} />
            <Route path="requests" element={<FriendRequests />} />
            <Route path="suggestions" element={<FriendSuggestions />} />
            <Route path="profile/view" element={<MemberProfile />} />
            <Route path="friends-search" element={<FriendsSearch />} />
          </Route>

          {/* Search Routes - Assuming they share Dashboard layout, if not, keep separate */}
          <Route
            path="/search/members"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdvancedMemberSearch />} />
          </Route>

          {/* Admin Routes - Protected but no specific layout enforced yet */}
          <Route
            path="/admin-website/groups"
            element={<AdminGroupsManager />}
          />
          <Route
            path="/admin-website/members"
            element={<AdminMembersManager />}
          />
          <Route path="/admin-website/contents" element={<MainFeedManager />} />
          <Route
            path="/admin-website/reports"
            element={<AdminReportsManager />}
          />
        </Routes>
      </WebSocketProvider>
    </>
  );
}

export default App;
// Test CI/CD
