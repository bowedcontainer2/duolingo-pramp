import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import webRTCService from '../services/webRTC';
import PracticeSession from '../components/PracticeSession';
import { createMockPartner } from '../services/mockPartner';
import SessionResults from '../components/SessionResults';
import { Fade } from '@mui/material';
import { questionBank } from '../data/questionBank';
import { mockPeerImage } from '../assets/mockPeer';

const Root = styled('div')({
  minHeight: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  backgroundColor: '#f5f5f5',
});

const ContentContainer = styled('div')(({ theme }) => ({
  flex: 1,
  width: '100%',
  maxWidth: '1600px',
  margin: '0 auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

const VideoContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundColor: '#000',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
}));

const PromptCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  zIndex: 1000,
}));

const VideoWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const Video = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PreviewVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
  transform: 'scaleX(-1)', // Mirror effect
});

const ControlButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '50%',
  minWidth: '50px',
  width: '50px',
  height: '50px',
  padding: 0,
}));

const MockPeerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questionBank.length);
  return { index: randomIndex, question: questionBank[randomIndex] };
};

const initialQuestion = getRandomQuestion();

const PracticeRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestioner, setIsQuestioner] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [sessionResults, setSessionResults] = useState([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(initialQuestion.index);
  const [currentPrompt, setCurrentPrompt] = useState(initialQuestion.question);
  const [usedQuestionIndices, setUsedQuestionIndices] = useState(new Set([initialQuestion.index]));

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const previewVideoRef = useRef();
  const mediaStreamRef = useRef();

  useEffect(() => {
    initializeMedia();
    return () => {
      // Cleanup media streams when component unmounts
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      setIsLoading(true);
      setMediaError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      mediaStreamRef.current = stream;
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setMediaError('Unable to access camera or microphone. Please check your permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const handleJoinSession = () => {
    if (!displayName.trim()) {
      return;
    }
    setIsSetupComplete(true);
  };

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Connect and get local stream
        const localStream = await webRTCService.connect(roomId, (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            setIsConnected(true);
          }
        });

        // Set local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

      } catch (error) {
        console.error('Failed to initialize call:', error);
      }
    };

    if (isSetupComplete) {
      initializeCall();
    }

    return () => {
      webRTCService.disconnect();
    };
  }, [roomId, isSetupComplete]);

  const getNextQuestion = () => {
    // If we've used all questions, reset the used indices
    if (usedQuestionIndices.size >= questionBank.length) {
      setUsedQuestionIndices(new Set());
    }

    // Get available question indices
    const availableIndices = questionBank
      .map((_, index) => index)
      .filter(index => !usedQuestionIndices.has(index));

    // Get random index from available questions
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // Add to used indices
    setUsedQuestionIndices(prev => new Set([...prev, randomIndex]));
    
    // Set new question
    setCurrentPromptIndex(randomIndex);
    setCurrentPrompt(questionBank[randomIndex]);
  };

  const handleAnswer = (correct) => {
    const result = {
      question: currentPrompt.question,
      spanishQuestion: currentPrompt.spanishQuestion,
      correct,
      timestamp: new Date()
    };
    
    if (questionCount >= 3) {
      setPendingResult(result);
      setShowEndSession(true);
    } else {
      setSessionResults(prev => [...prev, result]);
      setQuestionCount(prev => prev + 1);
      setIsQuestioner(prev => !prev);
      getNextQuestion();
    }
  };

  const handleConfirmEnd = () => {
    setSessionResults(prev => [...prev, pendingResult]);
    setQuestionCount(prev => prev + 1);
    setIsSessionComplete(true);
    webRTCService.disconnect();
    setIsConnected(false);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    
    setPendingResult(null);
    setShowEndSession(false);
  };

  const handleCancelEnd = () => {
    setShowEndSession(false);
    setPendingResult(null);
  };

  const handleStartNewSession = async () => {
    setSessionResults([]);
    setQuestionCount(0);
    setIsSessionComplete(false);
    setIsQuestioner(false);
    setUsedQuestionIndices(new Set()); // Reset used questions
    
    // Reinitialize media and connection
    try {
      await initializeMedia();
      await initializeCall();
    } catch (error) {
      console.error('Failed to restart session:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/'); // Make sure to import useNavigate from react-router-dom
  };

  const handleSpawnMockPartner = async () => {
    if (process.env.NODE_ENV === 'development') {
      try {
        setIsWaiting(true);
        console.log('Spawning mock partner...');
        const mockPartner = await createMockPartner(roomId);
        console.log('Mock partner created successfully');
        setIsConnected(true);
        setIsWaiting(false);
      } catch (error) {
        console.error('Failed to spawn mock partner:', error);
        setIsWaiting(false);
        // Maybe show an error message to the user
      }
    }
  };

  const handleSwitchRole = () => {
    setIsQuestioner(prev => !prev);
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    setSessionResults(prev => [...prev, {
      question: currentPrompt.question,
      spanishQuestion: currentPrompt.spanishQuestion,
      correct: false,
      incomplete: true,
      timestamp: new Date()
    }]);
    
    setIsSessionComplete(true);
    webRTCService.disconnect();
    setIsConnected(false);
    
    // Clean up media
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    
    setShowExitDialog(false);
  };

  if (!isSetupComplete) {
    return (
      <Root>
        <ContentContainer>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            minHeight="80vh"
            justifyContent="center"
          >
            <Typography 
              variant="h4" 
              gutterBottom 
              color="primary" 
              textAlign="center"
              sx={{ mb: 4 }}
            >
              Set Up Your Practice Session
            </Typography>
            
            <Box maxWidth="600px" width="100%">
              <VideoContainer sx={{ mb: 4 }}>
                {isLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : mediaError ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Alert severity="error" sx={{ width: '80%' }}>
                      {mediaError}
                    </Alert>
                  </Box>
                ) : (
                  <PreviewVideo
                    ref={previewVideoRef}
                    autoPlay
                    muted
                    playsInline
                  />
                )}
              </VideoContainer>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2 
              }}>
                <ControlButton
                  variant="contained"
                  color={isCameraOn ? "primary" : "error"}
                  onClick={toggleCamera}
                >
                  {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                </ControlButton>
                <ControlButton
                  variant="contained"
                  color={isMicOn ? "primary" : "error"}
                  onClick={toggleMic}
                >
                  {isMicOn ? <MicIcon /> : <MicOffIcon />}
                </ControlButton>
              </Box>

              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label="Your Display Name"
                  variant="outlined"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinSession}
                  disabled={!displayName.trim() || isLoading || !!mediaError}
                >
                  Join Practice Session
                </Button>
              </Box>
            </Box>
          </Box>
        </ContentContainer>
      </Root>
    );
  }

  return (
    <Root>
      <Fade in timeout={300}>
        <ContentContainer>
          <Grid container spacing={3}>
            {!isSessionComplete ? (
              // Only show video containers if session is not complete
              <>
                <Grid item xs={12} md={6}>
                  <VideoContainer>
                    <VideoWrapper>
                      <Video ref={localVideoRef} autoPlay muted />
                      {!isConnected && (
                        <LoadingOverlay>
                          <Box textAlign="center">
                            <CircularProgress color="inherit" />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                              {isWaiting ? 'Waiting for partner to join...' : 'Connecting...'}
                            </Typography>
                          </Box>
                        </LoadingOverlay>
                      )}
                    </VideoWrapper>
                    <Box position="absolute" top={16} right={16} zIndex={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleExit}
                        startIcon={<ExitToAppIcon />}
                        size="small"
                        sx={{
                          borderRadius: 20,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          }
                        }}
                      >
                        Leave Session
                      </Button>
                    </Box>
                  </VideoContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <VideoContainer>
                    <VideoWrapper>
                      {process.env.NODE_ENV === 'development' && !remoteVideoRef.current?.srcObject ? (
                        <MockPeerImage 
                          src={mockPeerImage} 
                          alt="Mock peer"
                        />
                      ) : (
                        <Video ref={remoteVideoRef} autoPlay />
                      )}
                      {!isConnected && (
                        <LoadingOverlay>
                          <CircularProgress color="inherit" />
                        </LoadingOverlay>
                      )}
                    </VideoWrapper>
                  </VideoContainer>
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              {isSessionComplete ? (
                <SessionResults
                  results={sessionResults}
                  onStartNew={handleStartNewSession}
                  onGoHome={handleGoHome}
                />
              ) : isConnected ? (
                <PracticeSession
                  isQuestioner={isQuestioner}
                  currentPrompt={currentPrompt}
                  onCorrectAnswer={() => handleAnswer(true)}
                  onIncorrectAnswer={() => handleAnswer(false)}
                  questionCount={questionCount}
                  onSwitchRole={handleSwitchRole}
                  showEndSession={showEndSession}
                  onConfirmEnd={handleConfirmEnd}
                  onCancelEnd={handleCancelEnd}
                />
              ) : (
                <>
                  <Typography variant="body1" color="textSecondary" textAlign="center">
                    Waiting to connect with your practice partner...
                  </Typography>
                  {process.env.NODE_ENV === 'development' && (
                    <Box textAlign="center" mt={2}>
                      <Button
                        variant="outlined"
                        onClick={handleSpawnMockPartner}
                        size="small"
                      >
                        Spawn Test Partner (Dev Only)
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </ContentContainer>
      </Fade>
      
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Leave Session Early?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end the session early? 
            Your progress so far will be saved, but the session will be marked as incomplete.
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="primary">
              Current Score: {Math.round((sessionResults.filter(r => r.correct).length / sessionResults.length) * 100)}%
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Questions Completed: {sessionResults.length} of 4
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)} color="primary">
            Continue Session
          </Button>
          <Button onClick={handleConfirmExit} variant="contained" color="error">
            Exit Session
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default PracticeRoom; 