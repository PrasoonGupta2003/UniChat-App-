import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
export { app };

export const server = http.createServer(app);

const allowedOrigins = [
  "https://unichat-app-n7nx.onrender.com",
  "http://localhost:5173"
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Socket CORS blocked: " + origin));
      }
    },
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
    console.log(`✅ ${userId} connected with socket ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`❌ ${userId} disconnected`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io };

