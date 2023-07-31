"use client";

import { AppContext } from "@/providers/AppProvider";
import generateRandomAvatar from "@/utils/utils";
import Avatar from "avataaars";
import Cookies from "js-cookie";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/providers/SocketProvider";

interface joinRoomType {
  urlRoomId?: string | null;
}

export default function JoinRoom({ urlRoomId }: joinRoomType) {
  const { userId, userName, setUserName, userAvatar, setUserAvatar, setJoinedRoom } = useContext(AppContext);
  const [createRoomLoader, setCreateRoomLoader] = useState(false);
  const [roomId, setRoomId] = useState(urlRoomId || "");
  const [joinRoomError, setJoinRoomError] = useState(false);
  const [createRoomError, setCreateRoomError] = useState(false);
  const router = useRouter();

  const handleGenerateRandomAvatar = () => {
    const generatedOptions = generateRandomAvatar();
    setUserAvatar(generatedOptions);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleChangRoomId = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const handleCreateRoom = async () => {
    setCreateRoomLoader(true);
    setCreateRoomError(false);

    try {
      const response: any = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/server/create-room`, { method: "POST" });
      const data = await response.json();
      const roomId = data.id;
      router.push(`/room?id=${roomId}`);
      setJoinedRoom(true);
    } catch (err) {
      setCreateRoomError(true);
      console.log(err);
    }
    setCreateRoomLoader(false);
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();
    setJoinRoomError(false);

    const requestBody = JSON.stringify({ roomId: roomId });

    try {
      const response: any = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/server/join-room`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: requestBody,
      });
      const data = await response.json();

      if (data.id) {
        setJoinedRoom(true);
        router.push(`/room?id=${roomId}`);
      } else {
        setJoinRoomError(true);
      }
    } catch (error) {
      setJoinRoomError(true);
    }
  };

  return (
    <form onSubmit={handleJoinRoom}>
      <div className="flex gap-10 w-full justify-between">
        <div className="bg-[#2E373E] rounded-lg p-10 flex-1">
          <div className="flex justify-between gap-20">
            <div className="w-full max-w-[400px]">
              <h2 className="mb-6">Welcome to our party game</h2>
              <input type="text" title="username" className="bg-[#424E57] p-4 rounded-lg w-full" placeholder="Enter your name" required onChange={handleChangeName} value={userName} />
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <div className="relative -top-4 -mb-4">{userAvatar && <Avatar style={{ width: "175px", height: "175px" }} avatarStyle={userAvatar.style} topType={userAvatar.topType} accessoriesType={userAvatar.accessoriesType} hairColor={userAvatar.hairColor} facialHairType={userAvatar.facialHairType} clotheType={userAvatar.clotheType} clotheColor={userAvatar.clotheColor} eyeType={userAvatar.eyeType} eyebrowType={userAvatar.eyebrowType} mouthType={userAvatar.mouthType} skinColor={userAvatar.skinColor} />}</div>
              <div onClick={handleGenerateRandomAvatar} className="cursor-pointer relative top-4 hover:opacity-80 active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#2E373E] rounded-lg p-10 lg:min-w-[400px]">
          <div>
            <div className="relative flex items-center h-[56px]">
              <input type="text" title="username" className="bg-[#424E57] p-4 rounded-lg w-full rounded-r-none h-full" placeholder="Enter room ID" required onChange={handleChangRoomId} value={roomId} />
              <button className="bg-secondary px-10 rounded text-center font-semibold h-full  hover:opacity-80 active:scale-95 transition-all">Join</button>
            </div>
            {joinRoomError && <div className="text-red-500 text-center py-2">Room not available</div>}
          </div>
          <div className="text-center py-4">or</div>
          <div>
            <button type="button" onClick={handleCreateRoom} disabled={!userName || createRoomLoader} className="bg-primary px-10 py-4 rounded text-center font-semibold w-full cursor-pointer disabled:bg-gray-500 disabled:cursor-default hover:opacity-80 active:scale-95 transition-all">
              {createRoomLoader ? "Loading" : "Create Private Room"}
            </button>
            {createRoomError && <div className="text-red-500 text-center py-2">Service not available</div>}
          </div>
        </div>
      </div>
    </form>
  );
}
