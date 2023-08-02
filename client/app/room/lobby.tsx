"use client";

import Logo from "@/components/logo";
import { AppContext } from "@/providers/AppProvider";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/providers/SocketProvider";
import Sidebar from "@/components/sidebar";
import Game from "@/components/game";

export default function Lobby() {
  const { userId, userName, userAvatar } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const [socketId, setSocketId] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [gameData, setGameData] = useState<any>({});
  const [gameStatus, setGetStatus] = useState<"waiting" | "started" | "finished">("waiting");

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  useEffect(() => {
    if (!roomId || !userId || !userName || !socket) return;

    if (socket.connected) {
      socket.disconnect();
    }

    const user = { name: userName, avatar: userAvatar };

    socket.on("connect", () => {
      const socketId = socket?.id;
      if (socketId) {
        console.log(`Connected on socket: ${socketId}`);
        setSocketId(socketId);
      }
    });

    socket.on("room:users", (users: any) => {
      setUsers(users);
    });

    socket.on("room:status:started", (gameData: any) => {
      setGameData(gameData);
      setGetStatus("started");
    });

    socket.on("room:status:finished", () => {
      setGetStatus("finished");
    });

    socket.connect();
    socket.emit("room:new-client", user, roomId);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, roomId, userAvatar, userId]);

  if (!roomId || !userId || !userName) {
    return <div>Impossible to connect, please reload</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-12 pb-24">
      <Logo type="small" />
      <main className="w-full h-full flex-1 flex">
        <div className="container mx-auto flex-1">
          <div className="flex gap-10 w-full items-start">
            <div className="bg-[#2E373E] rounded-lg flex-1 p-10 flex items-center justify-center min-h-[600px]">
              <Game status={gameStatus} users={users} gameData={gameData} />
            </div>
            <Sidebar users={users} socketId={socketId} gameData={gameData} />
          </div>
        </div>
      </main>
    </div>
  );
}
