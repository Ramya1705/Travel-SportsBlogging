import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

// Import Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Main Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditProfilePage from './pages/EditProfilePage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminPostPage from './pages/admin/AdminPostPage';
import AdminCommentPage from './pages/admin/AdminCommentPage';

// 🆕 Updated Sports/Travel Imports
import Sports from './Sports/Mainpage';
import SportsRouter from './Sports/SportsRouter/index1';
import SportDetailPage from './components/SportDetailPage';
import Recommend from './components/Recommended/Recommend';
import DestinationDetail from './components/destinations/DestinationDetail.js';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const ConditionalNavbar = () => {
  const location = useLocation();
  return location.pathname.startsWith('/admin') ? null : <Navbar />;
};

const ConditionalFooter = () => {
  const location = useLocation();
  return location.pathname.startsWith('/admin') ? null : <Footer />;
};

const MainSiteLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <ConditionalNavbar />
      <Box
        component="main"
        sx={{
          paddingTop: isHomePage ? 0 : '80px',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {children}
      </Box>
      <ConditionalFooter />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <MainSiteLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/post/:id" element={<PostPage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<RegisterPage />} />
                  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                  {/* ✅ Updated Sports/Travel Routes */}
                  <Route path="/sports" element={<Sports />} />
                  <Route path="/sport/:id" element={<SportsRouter />} />
                  <Route path="/sports/:sportName" element={<SportDetailPage />} />
                  <Route path="/travel" element={<Recommend />} />
                  <Route path="/destinations/:destinationId" element={<DestinationDetail />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/create-post" element={<CreatePostPage />} />
                    <Route path="/edit-post/:id" element={<CreatePostPage editMode />} />
                    <Route path="/profile/edit" element={<EditProfilePage />} />
                  </Route>
                </Routes>
              </MainSiteLayout>
            }
          />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserPage />} />
              <Route path="posts" element={<AdminPostPage />} />
              <Route path="comments" element={<AdminCommentPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
