// Success sound from Duolingo (or similar sound effect)
const SUCCESS_SOUND_URL = '/sounds/duolingo_correct_chime.mp3';

class AudioService {
  constructor() {
    this.successSound = new Audio(SUCCESS_SOUND_URL);
  }

  playSuccess() {
    this.successSound.currentTime = 0; // Reset to start
    this.successSound.play().catch(err => {
      console.warn('Could not play success sound:', err);
    });
  }
}

export default new AudioService(); 