import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { generateRoomCode } from "../utils/utils";
import { firebaseCreateRoom, firebaseGetPhotos, firebaseIsRoomAvailable, firebaseUpdateRoomStatus } from "../firebase/firebase";
import { clientJoin, clientLeave, clients, gerRoomUsers } from "../utils/clients";
import bodyParser from "body-parser";
import { scheduleArchiving } from "./crons";
import { addRoom, roomType, settingsType } from "../utils/rooms";

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
  console.log(clients);

  socket.on("joinRoom", async (user: any, room: string) => {
    const { name, avatar } = user;
    const roomMaster = Boolean(!clients.length);

    const client = clientJoin({ id: socket.id, room, roomMaster, name, avatar });
    console.log(`User ${socket.id} joined room ${room}`);

    socket.join(room);
    io.to(room).emit("userList", gerRoomUsers(room));
  });

  socket.on("triggerGameStart", async (room: string, settings: settingsType) => {
    console.log(`*** game is starting on room ${room}  - ${settings.max} rounds ***`);

    const photos = await firebaseGetPhotos(settings?.max);

    io.to(room).emit("gameStart", { photos, settings });
  });

  socket.on("disconnect", () => {
    const client = clientLeave(socket.id);
    console.log(`user is disconnected ${client?.name}`);
    const room = client?.room ?? "";
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
