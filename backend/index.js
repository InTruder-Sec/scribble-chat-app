import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { userRouter } from "./routes/user.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "https://scribblechat.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routers
app.use("/users", userRouter);

// Connect to MongoDB
const connection = await mongoose.connect(process.env.SERVER_URL);

// Listen for socket.io connections
const server = app.listen(8080, () => {
  console.log("Server running on port 8080");
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSoket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("receive-msg", data);
//     }
//   });
// });
