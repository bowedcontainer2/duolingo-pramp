import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import { Fade } from '@mui/material';

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  maxWidth: '800px',
  width: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const QuestionList = styled(Stack)(({ theme }) => ({
  maxHeight: '40vh',
  overflowY: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
}));

const ResultsContainer = styled('div')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
});

const SessionResults = ({ results, onStartNew, onGoHome }) => {
  const correctAnswers = results.filter(r => r.correct).length;
  const totalQuestions = 4; // Total expected questions
  const completedQuestions = results.length;
  const isIncomplete = completedQuestions < totalQuestions;
  const score = Math.round((correctAnswers / completedQuestions) * 100);

  return (
    <ResultsContainer>
      <Fade in>
        <ResultCard elevation={3}>
          <Typography 
            variant="h4" 
            gutterBottom 
            color="primary"
            sx={{
              opacity: isIncomplete ? 0.8 : 1,
              mb: 3
            }}
          >
            {isIncomplete ? "Session Summary" : "Session Complete!"}
          </Typography>

          <Typography variant="h2" sx={{ mb: 3 }}>
            {score}%
          </Typography>

          <StatBox>
            <CheckCircleIcon color="success" />
            <Typography>
              {correctAnswers} correct out of {completedQuestions} questions
              {isIncomplete && ` (${totalQuestions - completedQuestions} questions remaining)`}
            </Typography>
          </StatBox>

          {isIncomplete && (
            <Alert 
              severity="info" 
              sx={{ 
                my: 2,
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
                '& .MuiAlert-icon': {
                  color: 'primary.main'
                }
              }}
            >
              You ended this session early. Your progress has been saved!
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Question History
          </Typography>

          <QuestionList spacing={2} sx={{ mb: 4 }}>
            {results.map((result, index) => (
              <Fade in timeout={300 * (index + 1)}>
                <Box key={index} display="flex" alignItems="center" gap={2}>
                  {result.incomplete ? (
                    <TimerOffIcon color="warning" />
                  ) : result.correct ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                  <Typography>
                    {result.question}
                  </Typography>
                </Box>
              </Fade>
            ))}
          </QuestionList>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={onStartNew}
            >
              Start New Session
            </Button>
            <Button
              variant="outlined"
              onClick={onGoHome}
            >
              Go Home
            </Button>
          </Stack>
        </ResultCard>
      </Fade>
    </ResultsContainer>
  );
};

export default SessionResults; 