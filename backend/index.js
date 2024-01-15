import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { userRouter } from "./routes/user.js";

dotenv.config();



const app = express();
const corsOptions = {
  origin: process.env.ENDPOINT,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io
const httpServer = http.createServer(app);

const socketIO = new Server(httpServer, {
  cors: {
    origin: process.env.ENDPOINT,
    credentials: true,
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });

  socket.on("join-room", (roomId) => {
    console.log(roomId);
    socket.join(roomId);
  });

  socket.on("send-message", (data) => {
    socket.in(data.room).emit("receive-message", data);
  });

  socket.on("send", (data) => {
    socketIO.to(data.room).emit("receive-message", data);
  });
});

// Use the routers
app.use("/users", userRouter);

// Connect to MongoDB
const connection = await mongoose.connect(process.env.SERVER_URL);

httpServer.listen(8080, () => console.log(`Listening on port 8080`));
