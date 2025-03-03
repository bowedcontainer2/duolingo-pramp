import io from 'socket.io-client';
import { Peer } from 'peerjs';

class MockPartner {
  constructor() {
    this.socket = null;
    this.peer = null;
    this.stream = null;
    this.interval = null;
  }

  async connect(roomId) {
    try {
      // Create mock stream
      this.stream = await this.createMockStream();

      // Connect socket
      this.socket = io('http://localhost:5001');
      
      // Create peer
      this.peer = new Peer(undefined, {
        host: 'localhost',
        port: 5001,
        path: '/peerjs'
      });

      // When peer is ready
      this.peer.on('open', (id) => {
        console.log('Mock peer ID:', id);
        this.socket.emit('join-room', roomId, id);
      });

      // Handle incoming calls
      this.peer.on('call', (call) => {
        console.log('Mock peer answering call');
        call.answer(this.stream);
      });

    } catch (error) {
      console.error('Mock partner error:', error);
      this.disconnect();
      throw error;
    }
  }

  async createMockStream() {
    try {
      // Create a canvas element to generate mock video
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      // Create an animation loop to simulate video
      this.interval = setInterval(() => {
        // Draw a simple animation
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.fillText('Mock Partner', 200, 240);
        ctx.fillText(new Date().toLocaleTimeString(), 200, 300);
      }, 1000/30); // 30 fps

      // Get the stream from the canvas
      const stream = canvas.captureStream(30);

      // Create silent audio track
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const dst = audioCtx.createMediaStreamDestination();
      
      // Connect nodes but set volume to 0
      oscillator.connect(gainNode);
      gainNode.connect(dst);
      gainNode.gain.value = 0; // Mute the audio
      oscillator.start();

      // Combine video and silent audio
      const tracks = [...stream.getVideoTracks(), ...dst.stream.getAudioTracks()];
      return new MediaStream(tracks);
    } catch (error) {
      console.error('Error creating mock stream:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export const createMockPartner = async (roomId) => {
  try {
    // Add logging
    console.log('Creating mock partner for room:', roomId);
    
    const mockPeer = new Peer();
    
    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      mockPeer.on('open', resolve);
      mockPeer.on('error', reject);
    });

    console.log('Mock peer created successfully');
    
    // Connect to the room
    const conn = mockPeer.connect(roomId);
    
    conn.on('open', () => {
      console.log('Mock peer connected to room');
      
      // Send mock video stream
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mockPeer.call(roomId, stream);
        })
        .catch(err => console.error('Failed to get mock stream:', err));
    });

    return mockPeer;
  } catch (error) {
    console.error('Failed to create mock partner:', error);
    throw error;
  }
}; 