import { io } from 'socket.io-client';

const io = require("socket.io")(server, {
  cors: {
    origin: "https://web-ide-a2i0.onrender.com/",
    methods: ["GET", "POST"],
  },
});
  

const socket = io("https://web-ide-a2i0.onrender.com/");
 
export default socket;