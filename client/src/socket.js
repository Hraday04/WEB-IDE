import { io } from 'socket.io-client';

// const socket = io("https://web-ide-bcop.onrender.com/");
const socket = io("http://localhost:9000"); // or wherever the server runs

 
export default socket;