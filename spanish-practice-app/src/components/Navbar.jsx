import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
}));

const NavContainer = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 24px',
});

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
}));

const NavButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <NavContainer>
          <Logo component={Link} to="/">
            <SchoolIcon fontSize="large" />
            <Typography variant="h6" fontWeight="bold">
              SpanishPractice
            </Typography>
          </Logo>

          <NavButtons>
            <NavButton 
              component={Link} 
              to="/schedule"
            >
              Schedule Practice
            </NavButton>
            <NavButton 
              component={Link} 
              to="/history"
            >
              History
            </NavButton>
            {/* Add this once we implement authentication */}
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 }
              }}
            >
              U
            </Avatar>
          </NavButtons>
        </NavContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 