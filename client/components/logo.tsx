"use client";
import { SocketContext } from "@/providers/SocketProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function Logo() {
  const { socket } = useContext(SocketContext);

  return (
    <div className="pb-20">
      <div className={`absolute top-0 w-full left-0 text-center py-2 ${socket.connected ? "bg-green-500" : "bg-red-500"}`}>{socket.connected ? "Connected" : "No connected"}</div>
      <Link href="/">
        <Image src="/phototime-logo.svg" alt="PhotoTime Logo" width={200} height={24} priority className="mx-auto" />
      </Link>
    </div>
  );
}
