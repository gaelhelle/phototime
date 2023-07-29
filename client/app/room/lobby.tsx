"use client";

import Logo from "@/components/logo";
import { AppContext } from "@/providers/AppProvider";
import Avatar from "avataaars";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Tooltip } from "react-tooltip";
import { Socket } from "socket.io-client";

export default function Lobby() {
  const { userId, userName, userAvatar } = useContext(AppContext);
  const [socketId, setSocketId] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const [users, setUsers] = useState([]);
  const [isRoomMaster, setIsRoomMaster] = useState(false);

  const socket = useRef<Socket | null>(null);

  const triggerGameStart = () => {
    if (!socket.current) return;
    socket.current.emit("triggerGameStart", roomId);
  };

  useEffect(() => {
    if (!users || !socketId) return;
    const user: any = users.find((user: any) => user.id === socketId);
    setIsRoomMaster(user?.roomMaster);
  }, [users, socketId]);

  useEffect(() => {
    if (!roomId || !userId || !userName) return;

    socket.current = io("http://localhost:8080", { transports: ["websocket"], autoConnect: false });

    const user = { name: userName, avatar: userAvatar };

    socket.current.on("connect", () => {
      const socketId = socket.current?.id;
      if (socketId) {
        console.log(`Connected on socket: ${socket.current?.id}`);
        setSocketId(socket.current?.id);
      }
    });

    socket.current.on("userList", (users: any) => {
      setUsers(users);
    });

    socket.current.connect();
    socket.current.emit("joinRoom", user, roomId);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  if (!roomId || !userId || !userName) {
    return <div>Impossible to connect, please reload</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-24 ">
      <header className="text-left">
        <Logo />
      </header>
      <main className="w-full h-full flex-1 flex">
        <div className="container mx-auto flex-1">
          <div className="flex gap-10 w-full items-start">
            <div className="bg-[#2E373E] rounded-lg flex-1 p-10 h-screen flex items-center justify-center">
              <div className="text-center">
                <h2>Waiting for the game to start</h2>
                {isRoomMaster && (
                  <div className="mt-20">
                    <div>
                      <button onClick={triggerGameStart} type="button" className="bg-primary px-10 py-4 rounded text-center font-semibold cursor-pointer disabled:bg-gray-500">
                        Start the game
                      </button>
                    </div>
                    <button type="button" className="inline-flex gap-2 items-center mt-8 opacity-70 hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>

                      <span>Change room settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#2E373E] rounded-lg min-w-[400px] pb-6">
              <h2 className="font-semibold px-10 py-6">Players ({users.length})</h2>
              <div className="bg-[#252D33]">
                {users?.map((user: any) => (
                  <div className="px-10 py-3 flex gap-2 items-center" key={user.id}>
                    <Avatar style={{ width: "48px", height: "48px" }} avatarStyle={user.avatar.style} topType={user.avatar.topType} accessoriesType={user.avatar.accessoriesType} hairColor={user.avatar.hairColor} facialHairType={user.avatar.facialHairType} clotheType={user.avatar.clotheType} clotheColor={user.avatar.clotheColor} eyeType={user.avatar.eyeType} eyebrowType={user.avatar.eyebrowType} mouthType={user.avatar.mouthType} skinColor={user.avatar.skinColor} />
                    <span>
                      {user.name} {socketId === user.id && <span>(You)</span>}
                    </span>
                    {user.roomMaster && (
                      <>
                        <Tooltip id="my-tooltip" content="Host of the room" />

                        <svg data-tooltip-id="my-tooltip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#E89029]">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
