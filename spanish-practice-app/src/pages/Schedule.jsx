import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Custom styled components for better typography
const PageTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Outfit", sans-serif',
  fontSize: '2.75rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  letterSpacing: '-0.02em',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Outfit", sans-serif',
  fontSize: '1.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  letterSpacing: '-0.01em',
}));

const TimeSlotText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  lineHeight: 1.6,
  color: theme.palette.primary.main,
}));

const TimeSlotSubtext = styled(Typography)(({ theme }) => ({
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  letterSpacing: '0.02em',
}));

const TimeSlotPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const Schedule = () => {
  const navigate = useNavigate();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock available time slots
  const availableSlots = [
    { id: 1, day: 'Tomorrow', time: '10:00 AM', partner: null },
    { id: 2, day: 'Tomorrow', time: '2:00 PM', partner: "Maria S." },
    { id: 3, day: 'In 2 days', time: '11:00 AM', partner: null },
  ];

  // Time options for the select
  const timeOptions = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  // Day options for the select
  const dayOptions = [
    'Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days'
  ];

  const handleTimeSlotClick = (slot) => {
    // If slot has a partner, join the session
    // If not, create a new session
    if (slot.partner) {
      navigate(`/practice/${slot.id}`);
    } else {
      navigate(`/practice/${slot.id}`);
    }
  };

  const handleCreateSession = () => {
    if (selectedDay && selectedTime) {
      // Here you would typically make an API call to create the session
      const newSessionId = Math.random().toString(36).substr(2, 9);
      navigate(`/practice/${newSessionId}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PageTitle variant="h4" gutterBottom fontWeight="bold" color="primary">
        Schedule Practice Session
      </PageTitle>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenCreateDialog(true)}
          sx={{ mr: 2 }}
        >
          Create New Session
        </Button>
      </Box>

      <SectionTitle variant="h6" gutterBottom color="textSecondary">
        Available Time Slots
      </SectionTitle>

      <Grid container spacing={3}>
        {availableSlots.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
            <TimeSlotPaper
              elevation={2}
              onClick={() => handleTimeSlotClick(slot)}
            >
              <TimeSlotText variant="h6" gutterBottom>
                {slot.day}
              </TimeSlotText>
              <TimeSlotText color="primary">
                {slot.time}
              </TimeSlotText>
              {slot.partner ? (
                <TimeSlotSubtext sx={{ mt: 1 }}>
                  Practice with {slot.partner}
                </TimeSlotSubtext>
              ) : (
                <TimeSlotSubtext color="success.main" sx={{ mt: 1 }}>
                  Available
                </TimeSlotSubtext>
              )}
            </TimeSlotPaper>
          </Grid>
        ))}
      </Grid>

      {/* Create Session Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Practice Session</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Day</InputLabel>
              <Select
                value={selectedDay}
                label="Day"
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {dayOptions.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Time</InputLabel>
              <Select
                value={selectedTime}
                label="Time"
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateSession}
            disabled={!selectedDay || !selectedTime}
          >
            Create Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule; 