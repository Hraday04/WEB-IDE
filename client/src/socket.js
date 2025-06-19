import { io } from 'socket.io-client';

const socket = io("https://web-ide-bcop.onrender.com/");
 
export default socket;