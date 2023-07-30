"use client";

import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { AvatarStyle } from "avataaars";
import generateRandomAvatar from "@/utils/utils";

type AppContextType = {
  userId: string | null;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  userAvatar: any;
  setUserAvatar: Dispatch<SetStateAction<any>>;
  joinedRoom: boolean;
  setJoinedRoom: Dispatch<SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType>(undefined as any);

export const AppProvider = ({ children }: any) => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<AvatarStyle | null>(null);
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    const existingUserName = Cookies.get("userName");
    const existingAvatar = Cookies.get("userAvatar");

    const newUserId = uuidv4();
    setUserId(newUserId);

    if (existingUserName) {
      setUserName(existingUserName);
    }

    if (existingAvatar) {
      setUserAvatar(JSON.parse(existingAvatar));
    } else {
      const generatedOptions = generateRandomAvatar();
      setUserAvatar(generatedOptions);
    }
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_COOKIES) Cookies.set("userName", userName);
  }, [userName]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_COOKIES) Cookies.set("userAvatar", JSON.stringify(userAvatar));
  }, [userAvatar]);

  const values = { userId, userName, setUserName, userAvatar, setUserAvatar, joinedRoom, setJoinedRoom };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
