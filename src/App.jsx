import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./context/WebSocketContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import PageLoadingFallback from "./components/common/PageLoadingFallback";
import { ThemeProvider } from "./context/ThemeContext";
import GroupDeletedModal from "./components/common/GroupDeletedModal";
import { toastConfig } from "./config/toastConfig";
import { clearSession, initializeAuth } from "./redux/slices/authSlice";

const isMockMode = import.meta.env.VITE_USE_MOCK === "true";
const MockDevPanel = isMockMode ? lazy(() => import("./mocks/components/MockDevPanel")) : null;

// --- Route-based Code Splitting (React.lazy) ---
// Auth & Public Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const Step1 = lazy(() => import("./pages/registration/Step1"));
const TermsOfService = lazy(() => import("./pages/auth/TermsOfService"));
const OAuth2RedirectHandler = lazy(() => import("./pages/auth/OAuth2RedirectHandler"));

// Onboarding Route
const OnboardingPage = lazy(() => import("./pages/registration/OnboardingPage"));

// Main Dashboard Routes
const Newsfeed = lazy(() => import("./pages/dashboard/Newsfeed"));
const PostDetailPage = lazy(() => import("./pages/dashboard/PostDetailPage"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage.jsx"));
const FriendsPage = lazy(() => import("./pages/dashboard/FriendsPage"));
const PrivacySettings = lazy(() => import("./pages/dashboard/PrivacySettings"));

// Complex Modules (Chat, Groups, Search)
const ChatInterface = lazy(() => import("./pages/dashboard/ChatInterface"));
const GroupsManagement = lazy(() => import("./pages/dashboard/GroupsManagement"));
const GroupDetailPage = lazy(() => import("./pages/dashboard/GroupDetailPage"));
const CreateGroupPage = lazy(() => import("./pages/dashboard/CreateGroupPage"));
const EditGroupPage = lazy(() => import("./pages/dashboard/EditGroupPage"));
const AdvancedMemberSearch = lazy(() => import("./pages/search/AdvancedMemberSearch"));

// Admin Portal Routes
const AdminGroupsManager = lazy(() => import("./pages/admin-website/AdminGroupsManager.jsx"));
const AdminMembersManager = lazy(() => import("./pages/admin-website/AdminMembersManager.jsx"));
const MainFeedManager = lazy(() => import("./pages/admin-website/MainFeedManager.jsx"));
const AdminReportsManager = lazy(() => import("./pages/admin-website/AdminReportsManager.jsx"));

function App() {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.auth.authChecked);
  const authError = useSelector((state) => state.auth.error);
  const [initError, setInitError] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth())
      .unwrap()
      .catch((err) => {
        if (err?.status !== 401 && err?.status !== 403) {
          setInitError(true);
        }
      });

    const handleSessionExpired = () => dispatch(clearSession());
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [dispatch]);

  if (!authChecked && !initError) {
    return (
      <div className="min-h-screen grid place-items-center bg-background-main text-text-secondary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (initError && !authChecked) {
    return (
      <div className="min-h-screen grid place-items-center bg-background-main text-text-main p-4">
        <div className="max-w-md w-full bg-surface-main border border-border-main rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold">Không thể kết nối đến máy chủ</h3>
            <p className="text-sm text-text-secondary mt-1">
              {authError || "Hệ thống đang gặp sự cố kết nối hoặc phản hồi chậm. Vui lòng thử lại."}
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setInitError(false);
                dispatch(initializeAuth())
                  .unwrap()
                  .catch((err) => {
                    if (err?.status !== 401 && err?.status !== 403) {
                      setInitError(true);
                    }
                  });
              }}
              className="px-5 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Thử lại
            </button>
            <button
              onClick={() => {
                setInitError(false);
                dispatch(clearSession());
              }}
              className="px-5 py-2.5 bg-surface-secondary hover:bg-surface-secondary/80 text-text-secondary rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Tiếp tục với tư cách khách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Toaster {...toastConfig} />
      <WebSocketProvider>
        <GroupDeletedModal />
        {isMockMode && MockDevPanel && (
          <Suspense fallback={null}>
            <MockDevPanel />
          </Suspense>
        )}
        <Suspense fallback={<PageLoadingFallback />}>
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
              <Route path="groups" element={<GroupsManagement />} />
              <Route path="groups/:id" element={<GroupDetailPage />} />
              <Route path="groups/create" element={<CreateGroupPage />} />
              <Route path="groups/edit/:id" element={<EditGroupPage />} />
              <Route path="chat" element={<ChatInterface />} />
              <Route path="my-profile" element={<ProfilePage mode="self" />} />
              <Route path="member/:id" element={<ProfilePage mode="member" />} />
              <Route path="feed" element={<Newsfeed />} />
              <Route path="post/:id" element={<PostDetailPage />} />
              <Route path="profile/view" element={<ProfilePage mode="member" />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="settings/privacy" element={<PrivacySettings />} />
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

            {/* Admin Routes - Protected with ADMIN role */}
            <Route
              path="/admin-website"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="groups" element={<AdminGroupsManager />} />
              <Route path="members" element={<AdminMembersManager />} />
              <Route path="contents" element={<MainFeedManager />} />
              <Route path="reports" element={<AdminReportsManager />} />
            </Route>
          </Routes>
        </Suspense>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
// Test CI/CD
