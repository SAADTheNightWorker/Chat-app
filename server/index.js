import http from "http"; // Importing the 'http' module
import express from "express"; // Importing Express
import { PORT } from "./config/Config.js"; // Importing the PORT constant from Config.js
import { Server } from "socket.io"; // Importing the Server class from socket.io
import cors from "cors"; // Importing cors middleware

// Creating an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Creating an HTTP server using Express app
const server = http.createServer(app);

// Creating a new instance of socket.io server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity, adjust as needed
    methods: ["GET", "POST"]
  }
});

// Object to store users
const users = [{}];

// Event listener for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Event listener for 'joined' event
  socket.on("joined", ({ user }) => {
    // Add user to the users object with socket.id as key
    users[socket.id] = user;

    console.log(`${user} joined the chat`);

    // Sending a 'welcome' event to the current socket
    socket.emit("welcome", { user: "Admin", message: `Welcome to the chat, ${user}` });

    // Broadcast to all sockets except the current one
    socket.broadcast.emit("userJoined", { user: "Admin", message: `${user} has joined` });
  });

  // Event listener for 'message' event
  socket.on('message', ({ message }) => {
    const user = users[socket.id];
    if (user) {
      io.emit('sendMessage', { user, message, id: socket.id });
    }
  });

  // Event listener for 'disconnect' event
  socket.on('disconnec', () => {
    const user = users[socket.id];
    if (user) {
     
      socket.broadcast.emit("leave", { user: "Admin", message: `${user} has left` });
    
      console.log(`${user} disconnected`);
      delete users[socket.id]; // Remove user from the users object
    }
  });
});

// Define a route to handle GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
