"use client";

import Logo from "@/components/logo";
import { AppContext } from "@/providers/AppProvider";
import { useContext } from "react";
import Lobby from "./lobby";
import Landing from "@/components/landing";

export default function Room() {
  const { joinedRoom } = useContext(AppContext);

  if (!joinedRoom) {
    return <Landing />;
  }

  return <Lobby />;
}
