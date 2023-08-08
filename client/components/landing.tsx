"use client";

import Logo from "./logo";
import JoinRoom from "./join-room";
import { useSearchParams } from "next/navigation";
import HomeBloc from "./home-bloc";

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
        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          <HomeBloc title="About">
            <p className="mb-2">PhotoTime.io is a free online party game of guessing picture date.</p>
            <p className="mb-2">A normal game consists of few rounds where every player has to guess which year a picture has been taken. The closer you are the more points you get. </p>
            <p className="mb-2">The person with the most points at the end of the game wins. Let’s go!</p>
          </HomeBloc>
          <HomeBloc title="News">
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-gray-400 mr-2">Aug 7</span> Release 1.0.1 version
              </li>
              <li>
                <span className="text-gray-400 mr-2">Jul 24</span> Release 1.0.0 version
              </li>
            </ul>
          </HomeBloc>
        </div>
      </div>
    </main>
  );
}
