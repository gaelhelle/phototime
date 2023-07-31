"use client";

import React, { createContext, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
};

export const SocketContext = createContext<SocketContextType>(undefined as any);

export const SocketProvider = ({ children }: any) => {
  const defaultSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, { transports: ["websocket"], autoConnect: false });

  const [socket, setSocket] = useState<Socket>(defaultSocket);

  const values = { socket };

  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};
