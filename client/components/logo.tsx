"use client";
import { AppContext } from "@/providers/AppProvider";
import { SocketContext } from "@/providers/SocketProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

interface LogoProps {
  type?: "small";
}

export default function Logo(props: LogoProps) {
  const { devMode } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const { type } = props;

  const imageWidth = type === "small" ? 140 : 240;
  const imageheight = type === "small" ? 60 : 118;

  return (
    <div className="container mx-auto">
      {devMode && <div className={`absolute top-0 left-0 text-left py-2 inline-block px-4 text-xs rounded-br-lg ${socket.connected ? "bg-green-500" : "bg-red-500"}`}>Websocket status: {socket.connected ? "Online" : "Offline"}</div>}

      <div className={`${type === "small" ? "pb-6" : "pb-16 pt-4 text-center"}`}>
        <Link href="/" className="inline-block">
          <Image src="/phototime-logo.png" alt="PhotoTime Logo" width={imageWidth} height={imageheight} priority />
        </Link>
      </div>
    </div>
  );
}
