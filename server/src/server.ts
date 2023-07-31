import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { generateRoomCode } from "../utils/utils";
import { firebaseCreateRoom, firebaseGetPhotos, firebaseIsRoomAvailable, firebaseUpdateRoomStatus } from "../firebase/firebase";
import { clientJoin, clientLeave, clients, getRoomUsers, getUserRoomId, updateClientAnswers } from "../utils/clients";
import bodyParser from "body-parser";
import { scheduleArchiving } from "./crons";
import { settingsType } from "../utils/rooms";

const port = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// parse application/json
app.use(bodyParser.json());

const timeoutInMilliseconds = 3000; // 1 minute

io.on("connection", (socket) => {
  console.log(`User logged ${socket.id}`);

  socket.on("joinRoom", async (user: any, room: string) => {
    const { name, avatar } = user;
    const clientsInRoom = clients.filter((client) => client.room === room);
    const roomMaster = !Boolean(clientsInRoom.length);
    const client = clientJoin({ id: socket.id, room, roomMaster, name, avatar, answers: [], scores: [] });
    console.log(`User ${socket.id} joined room ${room}`);

    socket.join(room);
    io.to(room).emit("userList", getRoomUsers(room));
  });

  socket.on("triggerGameStart", async (room: string, settings: settingsType) => {
    console.log(`*** game is starting on room ${room}  - ${settings.max} rounds ***`);
    let photos: any = [];

    try {
      photos = await firebaseGetPhotos(settings?.max);
    } catch (error) {
      console.log(error);
    }

    io.to(room).emit("gameStart", { photos, settings });
  });

  socket.on("game:send-answer", async (answer: number) => {
    const client = updateClientAnswers(socket.id, answer);
    if (!client) return;

    const room = getUserRoomId(socket.id);
    io.to(room).emit("userList", getRoomUsers(client?.room));
  });

  socket.on("disconnect", () => {
    const room = getUserRoomId(socket.id);
    const client = clientLeave(socket.id);
    if (!client) return;
    console.log(`user is disconnected ${client?.name}`);
    io.to(room).emit("userList", clients);
  });
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});

app.use(cors());

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

scheduleArchiving();
