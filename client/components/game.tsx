import GameStarted from "./game-started";
import GameWaiting from "./game-waiting";
import Leaderboard from "./leaderboard";

interface GameProps {
  status: "waiting" | "started" | "finished";
  users: any[];
  gameData: any;
}

export default function Game(props: GameProps) {
  const { status, users, gameData } = props;

  if (status === "waiting") return <GameWaiting users={users} />;
  if (status === "started") return <GameStarted data={gameData} />;
  if (status === "finished") return <Leaderboard users={users} />;

  return null;
}
