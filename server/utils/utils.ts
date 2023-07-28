import { v4 as uuidv4 } from "uuid";

export const generateRoomCode = () => {
  const uuid = uuidv4();
  const code = uuid.substr(0, 6).toUpperCase();

  return code;
};
