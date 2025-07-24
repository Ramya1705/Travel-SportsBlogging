
// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import ForgotPasswordPage from './components/login_page/forgotPassword';
// // import HomePage from './components/Home/WebPage.js';
// // import SportsRouter from './Sports/SportsRouter/index1';
// // import Sports from './Sports/Mainpage.js';
// // import SportDetailPage from './components/SportDetailPage';
// // import Recommend from './components/Recommended/Recommend.js';
// // import PagesRouter from './components/PagesRouter/index.js';
// // import FeedbackAndSocial from './components/Feedback/feedback';
// // import BlogHome from './components/HomePage/Homepage.js';
// // import BlogPost from './components/BlogPost/Blogpost.js';
// // import NewBlogForm from './components/NewBlogForm/NewBlogForm.js';
// // import LoginPage2 from './components/Login2/login2.js';
// // import SignupPage2 from './components/Login2/SignupPage.js';
// // import DestinationDetail from './components/destinations/DestinationDetail.js';

// // const App = () => {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<HomePage />} /> 
// //         <Route path="/signup" element={<SignupPage2 />} />
// //         <Route path='/login' element={<LoginPage2 />} />
// //         <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
// //         <Route path="/about" element={<FeedbackAndSocial />} /> 
// //         <Route path="/sports" element={<Sports />} />
// //         <Route path="/sport/:id" element={<SportsRouter />} />
// //         <Route path="/sports/:sportName" element={<SportDetailPage />} />
// //         <Route path='/travel' element={<Recommend />} />
// //         <Route path="/page/:id" element={<PagesRouter />} />
// //         <Route path="/user/:userId" element={<BlogHome />} />
// //         <Route path="/user/:userId/blog/:blogId" element={<BlogPost />} />
// //         <Route path="/user/:userId/new-blog" element={<NewBlogForm />} />
// //         <Route path="/blog-posts" element={<BlogHome />} />
        
// //         {/* ✅ Route for Destination Detail Page */}
// //         <Route path="/destinations/:destinationId" element={<DestinationDetail />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

// // Import Components
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import AdminRoute from './components/auth/AdminRoute';
// import Navbar from './components/Navbar'; // Assuming Navbar is in this path

// // Import Main Pages
// import HomePage from './pages/HomePage';
// import ExplorePage from './pages/ExplorePage';
// import PostPage from './pages/PostPage';
// import ProfilePage from './pages/ProfilePage';
// import CreatePostPage from './pages/CreatePostPage';
// import EditProfilePage from './pages/EditProfilePage';

// // Import New Pages
// import SportsPage from './pages/SportsPage';
// import TravelPage from './pages/TravelPage';

// // Import Auth Pages
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import VerifyEmailPage from './pages/VerifyEmailPage';

// // Import Admin Pages
// import AdminLayout from './pages/admin/AdminLayout';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminUserPage from './pages/admin/AdminUserPage';
// import AdminPostPage from './pages/admin/AdminPostPage';
// import AdminCommentPage from './pages/admin/AdminCommentPage';

// const theme = createTheme({
//     palette: {
//         mode: 'light',
//     },
//     typography: {
//         fontFamily: 'Inter, sans-serif',
//     }
// });

// // Component to conditionally render Navbar
// const ConditionalNavbar = () => {
//     const location = useLocation();
    
//     // Don't show navbar on admin routes
//     if (location.pathname.startsWith('/admin')) {
//         return null;
//     }
    
//     return <Navbar />;
// };

// // Component for main site layout with navbar
// const MainSiteLayout = ({ children }) => {
//     const location = useLocation();
//     const isHomePage = location.pathname === '/';

//     return (
//         <>
//             <ConditionalNavbar />
//             <Box 
//                 component="main" 
//                 sx={{ 
//                     // Add padding-top only if it's not the homepage
//                     paddingTop: isHomePage ? 0 : '80px', // Navbar height
//                     minHeight: '100vh',
//                     width: '100%'
//                 }}
//             >
//                 {children}
//             </Box>
//         </>
//     );
// };

// function App() {
//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <Router>
//                 <Routes>
//                     {/* Main site routes with navbar */}
//                     <Route path="/*" element={
//                         <MainSiteLayout>
//                             <Routes>
//                                 {/* Public Routes */}
//                                 <Route path="/" element={<HomePage />} />
//                                 <Route path="/explore" element={<ExplorePage />} />
//                                 <Route path="/sports" element={<SportsPage />} /> {/* New Sports Page Route */}
//                                 <Route path="/travel" element={<TravelPage />} /> {/* New Travel Page Route */}
//                                 <Route path="/post/:id" element={<PostPage />} />
//                                 <Route path="/profile/:userId" element={<ProfilePage />} />
//                                 <Route path="/login" element={<LoginPage />} />
//                                 <Route path="/register" element={<RegisterPage />} />
//                                 <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
//                                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//                                 <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//                                 {/* Protected Routes */}
//                                 <Route element={<ProtectedRoute />}>
//                                     <Route path="/create-post" element={<CreatePostPage />} />
//                                     <Route path="/edit-post/:id" element={<CreatePostPage editMode />} />
//                                     <Route path="/profile/edit" element={<EditProfilePage />} />
//                                 </Route>
//                             </Routes>
//                         </MainSiteLayout>
//                     } />

//                     {/* Admin Routes (without navbar) */}
//                     <Route element={<AdminRoute />}>
//                         <Route path="/admin" element={<AdminLayout />}>
//                             <Route index element={<AdminDashboard />} />
//                             <Route path="users" element={<AdminUserPage />} />
//                             <Route path="posts" element={<AdminPostPage />} />
//                             <Route path="comments" element={<AdminCommentPage />} />
//                         </Route>
//                     </Route>
//                 </Routes>
//             </Router>
//         </ThemeProvider>
//     );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

// Import Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Added Footer import

// Import Main Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditProfilePage from './pages/EditProfilePage';

// Import New Pages
import SportsPage from './pages/SportsPage';
import TravelPage from './pages/TravelPage';

// Import Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Import Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminPostPage from './pages/admin/AdminPostPage';
import AdminCommentPage from './pages/admin/AdminCommentPage';

const theme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    }
});

// Component to conditionally render Navbar
const ConditionalNavbar = () => {
    const location = useLocation();
    if (location.pathname.startsWith('/admin')) {
        return null;
    }
    return <Navbar />;
};

// Component for main site layout with navbar and footer
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
                    width: '100%'
                }}
            >
                {children}
            </Box>
            <Footer /> {/* ✅ Footer included on all non-admin pages */}
        </>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Main site routes with navbar and footer */}
                    <Route path="/*" element={
                        <MainSiteLayout>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/explore" element={<ExplorePage />} />
                                <Route path="/sports" element={<SportsPage />} />
                                <Route path="/travel" element={<TravelPage />} />
                                <Route path="/post/:id" element={<PostPage />} />
                                <Route path="/profile/:userId" element={<ProfilePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/create-post" element={<CreatePostPage />} />
                                    <Route path="/edit-post/:id" element={<CreatePostPage editMode />} />
                                    <Route path="/profile/edit" element={<EditProfilePage />} />
                                </Route>
                            </Routes>
                        </MainSiteLayout>
                    } />

                    {/* Admin Routes (without navbar or footer) */}
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
