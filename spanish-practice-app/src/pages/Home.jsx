import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import TranslateIcon from '@mui/icons-material/Translate';

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  textAlign: 'center',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Typography
          variant="h2"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Practice Spanish Live
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Improve your Spanish speaking skills with real-time video practice sessions
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/schedule')}
          sx={{ 
            py: 2, 
            px: 4,
            fontSize: '1.2rem'
          }}
        >
          Start Practicing
        </Button>
      </HeroSection>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <FeatureCard elevation={2}>
            <VideocamIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Live Video Practice
            </Typography>
            <Typography color="textSecondary">
              Connect with other learners through video calls and practice speaking Spanish in real-time.
            </Typography>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <FeatureCard elevation={2}>
            <TranslateIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Structured Learning
            </Typography>
            <Typography color="textSecondary">
              Follow Duolingo-style prompts and get immediate feedback from your practice partner.
            </Typography>
          </FeatureCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 