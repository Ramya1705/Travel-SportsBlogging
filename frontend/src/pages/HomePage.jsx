import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { FaHome, FaFootballBall, FaPlane, FaSignInAlt, FaInfoCircle, FaSignOutAlt, FaPhoneAlt, FaCamera } from 'react-icons/fa';
import DestinationDetail from '../components/destinations/DestinationDetail.js';
// import Recommend from '../Recommended/Recommend';
import { FaBlogger } from 'react-icons/fa';
import { FaPenNib } from 'react-icons/fa';
import { FaInstagram, FaPinterest, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
// import FeedbackAndSocial from '../Feedback/feedback';
import Recommend from '../components/Recommended/Recommend';
import Sports from '../Sports/Mainpage';

import { 
  Box, 
  Container, 
  Typography, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const images = [
    "https://wallpapers.com/images/hd/travel-hd-4zjwrepl0mzn70nd.jpg",
    "https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/804570/pexels-photo-804570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box
        className="home-page"
        sx={{
          height: '100vh',
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'right',
          justifyContent: 'space-between',
          // Responsive adjustments
          minHeight: { xs: '80vh', sm: '90vh', md: '100vh' },
          backgroundAttachment: { xs: 'scroll', md: 'fixed' }
        }}
      >
        <Box component="header">
          <Box className="logo" sx={{ mt: { xs: 2, md: 3 } }}>
          </Box>
        </Box>
        
        <Box component="main" sx={{ textAlign: 'center' }}>
        </Box>
        
        <Box 
          className="featured" 
          sx={{ 
            mb: { xs: 3, sm: 4, md: 5 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: { 
                xs: '24px', 
                sm: '30px', 
                md: '36px',
                lg: '42px'
              },
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              mt: { xs: 2, md: 3 },
              lineHeight: { xs: 1.2, md: 1.4 },
              textAlign: 'center'
            }}
          >
            <Box component="span" sx={{ color: 'black' }}>S</Box>weat.
            <Box component="span" sx={{ color: 'black' }}>E</Box>xplore.
            <Box component="span" sx={{ color: 'black' }}>S</Box>hare.
          </Typography>
        </Box>
      </Box>
      
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          width: '100%',
          px: { xs: 0, sm: 1, md: 2 }
        }}
      >
        <Recommend/>
        <Sports />
      
      </Container>
    </>
  );
};

export default HomePage;