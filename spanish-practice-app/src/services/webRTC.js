import io from 'socket.io-client';
import { Peer } from 'peerjs';

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peer = null;
    this.stream = null;
  }

  async connect(roomId, onStream) {
    try {
      // Get media stream
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Connect socket
      this.socket = io('http://localhost:5001', {
        transports: ['websocket'],
        upgrade: false
      });
      
      // Create peer
      this.peer = new Peer(undefined, {
        host: 'localhost',
        port: 5001,
        path: '/peerjs'
      });

      // When peer is ready
      this.peer.on('open', (id) => {
        console.log('My peer ID:', id);
        this.socket.emit('join-room', roomId, id);
      });

      // When another peer joins
      this.socket.on('peer-joined', (peerId) => {
        console.log('Calling peer:', peerId);
        const call = this.peer.call(peerId, this.stream);
        
        call.on('stream', (remoteStream) => {
          console.log('Received stream from peer');
          onStream(remoteStream);
        });
      });

      // Handle incoming calls
      this.peer.on('call', (call) => {
        console.log('Answering call');
        call.answer(this.stream);
        
        call.on('stream', (remoteStream) => {
          console.log('Received stream from peer');
          onStream(remoteStream);
        });
      });

      return this.stream;

    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  disconnect() {
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

export default new WebRTCService(); 