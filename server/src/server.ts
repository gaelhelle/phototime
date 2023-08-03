import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { generateRoomCode } from "../utils/utils";
import { firebaseCreateRoom, firebaseGetPhotos, firebaseIsRoomAvailable, firebaseUpdateRoomStatus } from "../firebase/firebase";
import { clientJoin, clientLeave, clients, getRoomClients, getUserRoomId, updateClientAnswers } from "../utils/clients";
import bodyParser from "body-parser";
import { scheduleArchiving } from "./crons";
import { addRoom, deleteRoom, isGameFinished, settingsType } from "../utils/rooms";

const port = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket IO details
io.on("connection", (socket) => {
  console.log(`User logged ${socket.id}`);

  socket.on("room:new-client", async (user: any, room: string) => {
    const { name, avatar } = user;
    const clientsInRoom = clients.filter((client) => client.room === room);
    const roomMaster = !Boolean(clientsInRoom.length);
    const client = clientJoin({ id: socket.id, room, roomMaster, name, avatar, answers: [], scores: [] });
    console.log(`User ${socket.id} joined room ${room}`);

    socket.join(room);
    io.to(room).emit("room:users", getRoomClients(room));
  });

  socket.on("room:status:trigger-start", async (room: string, settings: settingsType) => {
    console.log(`*** game is starting on room ${room}  - ${settings.max} rounds ***`);
    let photos: any = [];

    try {
      photos = await firebaseGetPhotos(settings?.max);
    } catch (error) {
      console.log(error);
    }

    const serverRoom = addRoom({ id: room, photos, settings });

    io.to(room).emit("room:status:started", serverRoom);
  });

  socket.on("room:send-answer", async (answer: number) => {
    const room = getUserRoomId(socket.id);
    const client = updateClientAnswers(socket.id, answer);
    console.log(client);
    io.to(room).emit("room:users", getRoomClients(room));

    const gameIsFinished = isGameFinished(room);

    if (gameIsFinished) io.to(room).emit("room:status:finished");
  });

  socket.on("disconnect", () => {
    const room = getUserRoomId(socket.id);
    const client = clientLeave(socket.id);
    console.log(`user is disconnected ${client?.name}`);
    io.to(room).emit("room:users", getRoomClients(room));
    if (!getRoomClients(room).length) deleteRoom(room);
  });
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});

// API Server
app.use(bodyParser.json());
app.use(cors());

app.get("/server/", async (req, res) => {
  res.status(201).send("API is running");
});

app.post("/server/join-room", async (req, res) => {
  try {
    const roomId = req.body?.roomId;
    const result = await firebaseIsRoomAvailable(roomId);

    if (result) {
      res.status(201).send({
        id: roomId,
      });
    } else {
      throw Error;
    }
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).send({
      error: "Room not available. Please try again later.",
    });
  }
});

app.post("/server/create-room", async (req, res) => {
  try {
    const roomId = generateRoomCode();

    const photos = await firebaseGetPhotos(5);
    const data = { photos };
    await firebaseCreateRoom(roomId, data);
    res.status(201).send({
      id: roomId,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).send({
      error: "Failed to create room. Please try again later.",
    });
  }
});

app.post("/server/update-room", async (req, res) => {
  try {
    const roomId = req.body?.roomId;
    const status = req.body?.status;
    if (status) {
      await firebaseUpdateRoomStatus(roomId, status);
      res.status(201).send({
        id: roomId,
      });
    }
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).send({
      error: "Failed to update room. Please try again later.",
    });
  }
});

app.get("/server/get-photos", async (req, res) => {
  try {
    const limit = req.body?.limit || 5;
    const response = await firebaseGetPhotos(limit);
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send({
      error: "Failed to get photos. Please try again later.",
    });
  }
});

// scheduleArchiving();
