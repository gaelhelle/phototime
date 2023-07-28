import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { generateRoomCode } from "../utils/utils";
import { firebaseArchiveRooms, firebaseCreateRoom, firebaseGetUsers, firebaseIsRoomAvailable, firebaseUpdateRoomStatus, handleJoinRoom, handleLeaveRoom } from "../firebase/firebase";
import cron from "node-cron";
import { clientJoin, clientLeave, clients, gerRoomUsers } from "../utils/clients";
import bodyParser from "body-parser";

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

let rooms: any = [];

const timeoutInMilliseconds = 3000; // 1 minute

io.on("connection", (socket) => {
  console.log(`User logged ${socket.id}`);

  socket.on("joinRoom", (user: any, room: string) => {
    const { name, avatar } = user;
    const roomMaster = Boolean(!clients.length);
    const client = clientJoin({ id: socket.id, room, roomMaster, name, avatar });

    socket.join(room);
    io.to(room).emit("userList", gerRoomUsers(room));

    // console.log(clients);
  });

  socket.on("disconnect", () => {
    const client = clientLeave(socket.id);
    console.log(`user is disconnected ${client?.name}`);
    const room = client?.room ?? "";
    io.to(room).emit("userList", clients);
    console.log(clients);

    // clearTimeout(timeout);
  });

  // Disconnect the socket if there's no activity within the specified time
  // const timeout = setTimeout(() => {
  //   console.log(`Disconnecting idle socket ${socket.id}`);
  //   socket.disconnect(true);
  // }, timeoutInMilliseconds);
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
    console.error("Error creating room:", error);
    res.status(500).send({
      error: "Room not available. Please try again later.",
    });
  }
});

app.post("/server/create-room", async (req, res) => {
  try {
    const roomId = generateRoomCode();
    await firebaseCreateRoom(roomId);
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
    console.error("Error creating room:", error);
    res.status(500).send({
      error: "Failed to update room. Please try again later.",
    });
  }
});

// Schedule the archiving logic to run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    await firebaseArchiveRooms();
    console.log("Rooms archived successfully.");
  } catch (error) {
    console.error("Error archiving rooms:", error);
  }
});
