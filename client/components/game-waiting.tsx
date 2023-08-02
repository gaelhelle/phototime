import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "@/providers/SocketProvider";
import { useSearchParams } from "next/navigation";

interface GameWaitingProps {
  users: any[];
}

export default function GameWaiting(props: GameWaitingProps) {
  const { users } = props;

  const [isRoomMaster, setIsRoomMaster] = useState(false);

  const { socket } = useContext(SocketContext);
  const [maxRounds, setMaxRounds] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const triggerGameStart = () => {
    console.log({ socket, roomId, maxRounds });
    if (!socket) return;
    const settings = { max: maxRounds };
    socket.emit("room:status:trigger-start", roomId, settings);
  };

  const handleChangeMaxRounds = (e: ChangeEvent<HTMLSelectElement>) => {
    setMaxRounds(Number(e.target.value));
  };

  const toggleShowSettings = () => {
    setShowSettings((state) => !state);
  };

  useEffect(() => {
    if (!users || !socket.id) return;

    const user: any = users.find((user: any) => user.id === socket.id);

    console.log(user?.roomMaster);

    if (user?.roomMaster) {
      setIsRoomMaster(user.roomMaster);
    }
  }, [users, socket]);

  console.log(users);

  return (
    <div className="text-center w-full">
      <h2>Waiting for the game to start</h2>
      {isRoomMaster && (
        <div className="mt-20">
          <div>
            <button onClick={triggerGameStart} type="button" className="bg-primary px-10 py-4 rounded text-center font-semibold cursor-pointer disabled:bg-gray-500 hover:opacity-80 active:scale-95 transition-all">
              Start the game
            </button>
          </div>
          <div className="mt-8">
            {showSettings ? (
              <div className="bg-[#252D33] w-full rounded-lg py-10 text-left px-10 relative">
                <div className="flex gap-4 items-center">
                  <label>Number of rounds: </label>
                  <select title="Number of rounds" className="text-black w-12 rounded p-1" value={maxRounds} onChange={handleChangeMaxRounds}>
                    {[...Array(6)].map((x, i) => (
                      <option key={`rounds-${i}`} value={i + 5}>
                        {i + 5}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="absolute top-4 right-4" onClick={toggleShowSettings}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            ) : (
              <button type="button" className="inline-flex gap-2 items-center opacity-70 hover:opacity-100" onClick={toggleShowSettings}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <span>Change room settings</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
