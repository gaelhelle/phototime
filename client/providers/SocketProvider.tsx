"use client";

import React, { createContext } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
};

export const SocketContext = createContext<SocketContextType>(undefined as any);

export const SocketProvider = ({ children }: any) => {
  const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, { transports: ["websocket"], autoConnect: false });

  const values = { socket };

  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};
