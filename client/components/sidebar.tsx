import Avatar from "avataaars";
import { Tooltip } from "react-tooltip";

interface SidebarProps {
  users: any[];
  socketId: string;
  gameData: any;
}

export default function Sidebar(props: SidebarProps) {
  const { users, socketId, gameData } = props;
  const inviteLink = window.location.href;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log(`Copied to clipboard: ${text}`);
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="lg:min-w-[400px] w-full lg:w-auto">
      <div className="bg-[#2E373E] rounded-lg pb-6 mb-6">
        <h2 className="font-semibold px-10 py-6">Players ({users.length})</h2>
        <div className="bg-[#252D33] flex flex-col divide-y divide-black/20">
          {users?.map((user: any) => (
            <div className="px-10 py-2 flex gap-3 items-center" key={user.id}>
              <div className="relative -top-1 -mb-1">
                <Avatar style={{ width: "40px", height: "40px" }} avatarStyle={user.avatar.style} topType={user.avatar.topType} accessoriesType={user.avatar.accessoriesType} hairColor={user.avatar.hairColor} facialHairType={user.avatar.facialHairType} clotheType={user.avatar.clotheType} clotheColor={user.avatar.clotheColor} eyeType={user.avatar.eyeType} eyebrowType={user.avatar.eyebrowType} mouthType={user.avatar.mouthType} skinColor={user.avatar.skinColor} />
              </div>
              <div className="flex gap-3 items-center justify-between w-full">
                <div className="flex gap-3 items-center text-sm">
                  <span>
                    {user.name} {socketId === user.id && <span>(You)</span>}
                  </span>
                  {user.roomMaster && (
                    <>
                      <Tooltip id="tooltip-host" content="Host of the room" />
                      <svg data-tooltip-id="tooltip-host" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#E89029]">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </div>
                {gameData?.settings?.max && (
                  <div className="grid grid-cols-5 gap-1.5 text-sm">
                    {[...Array(gameData?.settings?.max)].map((x, i) => {
                      const done = user.answers[i];
                      const perfect = Number(gameData.photos[i].year) === user.answers[i];

                      return (
                        <div key={`answers-${user.id}-${i}`}>
                          {perfect && <Tooltip id={`tooltip-answer-${i}`} content="Found the exact year 🔥" />}
                          <span data-tooltip-id={`tooltip-answer-${i}`} className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? "bg-none" : "bg-black/20"} ${perfect ? "text-green-400" : "text-white"}`} key={`select-round-${i}`}>
                            {done ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#2E373E] rounded-lg px-10 py-6">
        <h3 className="mb-2">Invite your friends</h3>
        <div className="inline-flex gap-4 items-center">
          <div className="text-sm text-gray-400">{inviteLink}</div>
          <div className="text-sm">
            <Tooltip id="tooltip-copy-to-clipboard" content="Copied to clipboard!" delayHide={2000} openOnClick />
            <button type="button" data-tooltip-id="tooltip-copy-to-clipboard" className="px-2 py-1 rounded-lg bg-secondary cursor-pointer hover:opacity-80 active:scale-95 transition-all" onClick={() => handleCopyToClipboard(inviteLink)}>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
