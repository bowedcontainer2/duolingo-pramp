
# Duolingo Pramp!


A real-time language practice platform inspired by Duolingo's learning approach combined with Pramp's peer-to-peer interview format. Practice Spanish conversation with peers in structured, timed sessions. This project was inspired by me job hunting for a software engineering position and using Pramp/Exponent to practice for interviews. I also have been pretty competitive with friends in DuoLingo. I visited Guatemala with family, and in a coffee shop in Antigua, I saw tourists trying to practice micro interactions to order their coffee, and I got the idea to create a sort of pramp/duolingo hybrid where the pressure and accountability of a face to face video call is combined with the quick and segmented recitation formatting that Duolingo has. Here is my rough mvp of what this could look like! I used webRTC and peerJS to create a peer-to-peer connection between two users, and React + Vite + MUI to get things going. 

## Todo list:

[ ] Add time boxing to answer questions
[ ] Add a scheduler to connect users at booked timeslots, like pramp/exponent
[ ] Add a database to save session data, also to populate a question bank. (I just have some text spanish questions for now)
[ ] Friend feature to connect with friends and practice together(?)
[ ] History feature to look back on previous sessions and scores




### Real time connection stack:
- **WebRTC**: Peer-to-peer video and audio
- **WebSockets**: Signaling server for WebRTC connection establishment


## 🎯 Project Goals

1. Create an immersive language learning experience
2. Facilitate peer-to-peer practice sessions
3. Provide structured conversation practice
4. Give immediate feedback on performance

## 🚀 Getting Started

Nav to the client code
`cd spanish-practice-app`

Install dependencies
`npm install`

Start development server
`npm run dev`

Build for production
`npm run build`

Server:
`cd server`
`npm install`
`node index.js`
