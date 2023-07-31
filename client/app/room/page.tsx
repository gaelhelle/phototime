"use client";

import Logo from "@/components/logo";
import { AppContext } from "@/providers/AppProvider";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import JoinRoom from "@/components/join-room";
import Lobby from "./lobby";

export default function Room() {
  const { joinedRoom } = useContext(AppContext);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  if (!joinedRoom) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between  py-12 pb-24">
        <div className="container mx-auto">
          <div className="text-center">
            <Logo />
          </div>
          <JoinRoom urlRoomId={roomId} />
        </div>
      </main>
    );
  }

  return <Lobby />;
}
