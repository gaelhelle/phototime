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
  userAvatar: any | null;
};

export const AppContext = createContext<AppContextType>(undefined as any);

export const AppProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<AvatarStyle | null>(null);

  useEffect(() => {
    const existingUserId = Cookies.get("userId");
    const existingUserName = Cookies.get("userName");
    const existingAvatar = Cookies.get("userAvatar");

    if (existingUserId) {
      setUserId(existingUserId);
    } else {
      const newUserId = uuidv4();
      Cookies.set("userId", newUserId);
      setUserId(newUserId);
    }

    if (existingUserName) {
      setUserName(existingUserName);
    }

    if (existingAvatar) {
      setUserAvatar(JSON.parse(existingAvatar));
    } else {
      const generatedOptions = generateRandomAvatar();
      setUserAvatar(generatedOptions);
      Cookies.set("userAvatar", JSON.stringify(generatedOptions));
    }
  }, []);

  const values = { userId, userName, setUserName, userAvatar };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
