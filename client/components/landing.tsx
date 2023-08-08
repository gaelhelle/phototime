"use client";

import Logo from "./logo";
import JoinRoom from "./join-room";
import { useSearchParams } from "next/navigation";

export default function Landing() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 pb-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Logo />
        </div>
        <JoinRoom urlRoomId={roomId} />
      </div>
    </main>
  );
}
