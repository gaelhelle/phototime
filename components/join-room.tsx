"use client";

import { AppContext } from "@/providers/AppProvider";
import generateRandomAvatar from "@/utils/utils";
import Avatar from "avataaars";
import Cookies from "js-cookie";
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useState } from "react";

export default function JoinRoom() {
  const { userId, userName, setUserName, userAvatar } = useContext(AppContext);
  const [avatarOptions, setAvatarOptions] = useState<any>(null);

  const handleGenerateRandomAvatar = () => {
    const generatedOptions = generateRandomAvatar();
    setAvatarOptions(generatedOptions);
    Cookies.set("userAvatar", JSON.stringify(generatedOptions));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    Cookies.set("userName", e.target.value);
  };

  useEffect(() => {
    if (userAvatar) {
      setAvatarOptions(userAvatar);
    }
  }, [userAvatar]);

  return (
    <form>
      <div className="flex gap-4 w-full justify-between">
        <div className="bg-[#2E373E] rounded-lg p-10 flex-1">
          <div className="flex justify-between gap-20">
            <div className="w-full max-w-[400px]">
              <h2 className="mb-6">Welcome to our party game</h2>
              <input type="text" title="username" className="bg-[#424E57] p-4 rounded-lg w-full" placeholder="Enter your name" required onChange={handleChange} value={userName} />
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              {avatarOptions && <Avatar style={{ width: "175px", height: "175px" }} avatarStyle={avatarOptions.style} topType={avatarOptions.topType} accessoriesType={avatarOptions.accessoriesType} hairColor={avatarOptions.hairColor} facialHairType={avatarOptions.facialHairType} clotheType={avatarOptions.clotheType} clotheColor={avatarOptions.clotheColor} eyeType={avatarOptions.eyeType} eyebrowType={avatarOptions.eyebrowType} mouthType={avatarOptions.mouthType} skinColor={avatarOptions.skinColor} />}
              <div onClick={handleGenerateRandomAvatar} className="cursor-pointer hover:opacity-80 relative top-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#2E373E] rounded-lg p-10 lg:min-w-[400px]">
          <div className="relative flex items-center h-[56px]">
            <input type="text" title="username" className="bg-[#424E57] p-4 rounded-lg w-full rounded-r-none h-full" placeholder="Enter room ID" required />
            <button className="bg-secondary px-10 rounded text-center font-semibold h-full">Join</button>
          </div>
          <div className="text-center py-4">or</div>
          <button className="bg-primary px-10 py-4 rounded text-center font-semibold w-full">Create Private Room</button>
        </div>
      </div>
    </form>
  );
}
