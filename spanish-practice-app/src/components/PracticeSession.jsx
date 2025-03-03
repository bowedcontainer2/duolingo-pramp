import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Button,
  Fade,
  Chip,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import audioService from '../services/audioService';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginBottom: theme.spacing(3),
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  fontSize: '1rem',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const QuestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
}));

const Timer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const QUESTION_TIME_LIMIT = 60; // seconds

// Add a dev-only button to switch roles
const DevRoleSwitcher = ({ onSwitchRole, isQuestioner }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <Box textAlign="center" mt={2}>
      <Button
        variant="outlined"
        onClick={onSwitchRole}
        size="small"
        color="secondary"
      >
        Switch to {isQuestioner ? 'Answerer' : 'Questioner'} (Dev Only)
      </Button>
    </Box>
  );
};

// Add a helper component for difficulty stars
const DifficultyStars = ({ level }) => {
  return (
    <Box display="flex" gap={0.5}>
      {[...Array(5)].map((_, index) => (
        index < level ? (
          <StarIcon key={index} color="primary" fontSize="small" />
        ) : (
          <StarOutlineIcon key={index} color="disabled" fontSize="small" />
        )
      ))}
    </Box>
  );
};

const PracticeSession = ({
  isQuestioner,
  currentPrompt,
  onCorrectAnswer,
  onIncorrectAnswer,
  questionCount,
  onSwitchRole,
  showEndSession,
  onConfirmEnd,
  onCancelEnd
}) => {
  
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPrompt]);

  useEffect(() => {
    // Reset timer and show transition animation when roles switch
    setIsTransitioning(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
    const timeout = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timeout);
  }, [isQuestioner]);

  const handleAnswer = (correct) => {
    setIsTransitioning(true);
    if (correct) {
      audioService.playSuccess();
    }
    
    // Wait for transition out
    setTimeout(() => {
      setIsTransitioning(false); // Reset transition before next state
      if (correct) {
        onCorrectAnswer();
      } else {
        onIncorrectAnswer();
      }
    }, 300);
  };

  // Add effect to handle showEndSession transitions
  useEffect(() => {
    if (showEndSession) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [showEndSession]);

  return (
    <Box>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Question {questionCount + 1} of 4
        </Typography>
        <ProgressBar
          variant="determinate"
          value={((questionCount + (showEndSession ? 1 : 0)) / 4) * 100}
        />
      </Box>

      {/* Role Indicator */}
      <Fade in={!isTransitioning} timeout={500}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <RoleChip
            label={isQuestioner ? "You're the Questioner" : "You're the Answerer"}
            color={isQuestioner ? "primary" : "secondary"}
          />
          <Timer>
            <TimerIcon />
            <Typography>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
          </Timer>
        </Stack>
      </Fade>

      {/* Question/Answer Area */}
      <Fade in={!isTransitioning} timeout={500}>
        <QuestionCard elevation={3}>
          {showEndSession ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" gutterBottom color="primary">
                End Practice Session?
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                You finished the session! Exit and see results now.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={onCancelEnd}
                  size="large"
                >
                  Continue Session
                </Button>
                <Button
                  variant="contained"
                  onClick={onConfirmEnd}
                  size="large"
                  color="primary"
                >
                  View Results
                </Button>
              </Stack>
            </Box>
          ) : isQuestioner ? (
            <>
              <Typography variant="h6" gutterBottom>
                Ask this question in Spanish:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {currentPrompt.question}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom sx={{ my: 3 }}>
                "{currentPrompt.spanishQuestion}"
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Expected answer: {currentPrompt.expectedAnswer}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Difficulty:
                </Typography>
                <DifficultyStars level={currentPrompt.difficulty} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  onClick={() => handleAnswer(true)}
                >
                  Correct Answer ✓
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  onClick={() => handleAnswer(false)}
                >
                  Incorrect Answer ✗
                </Button>
              </Box>
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" gutterBottom>
                Listen and Respond
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Your partner will ask you a question in Spanish.
                Answer in Spanish to the best of your ability.
              </Typography>
            </Box>
          )}
        </QuestionCard>
      </Fade>

      {/* Add the dev role switcher */}
      <DevRoleSwitcher 
        onSwitchRole={onSwitchRole} 
        isQuestioner={isQuestioner}
      />
    </Box>
  );
};

export default PracticeSession; 