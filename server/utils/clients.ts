export interface clientType {
  id: string;
  roomMaster?: boolean;
  room: string;
  name: string;
  avatar?: any;
  answers: number[];
  scores: number[];
}
export const clients: clientType[] = [];

export const clientJoin = ({ id, room, roomMaster, name, avatar }: clientType) => {
  const client = { id, room, roomMaster, name, avatar, answers: [], scores: [] };
  clients.push(client);
  return client;
};

export const clientLeave = (id: string) => {
  const index = clients.findIndex((client) => client.id === id);
  const client = clients.find((client) => client.id === id);

  if (index !== -1) {
    clients.splice(index, 1);
  }

  return client;
};

export const getCurrentUser = (id: string) => {
  return clients.find((client) => client.id === id);
};

export const getRoomUsers = (room: string) => {
  return clients.filter((client) => client.room === room);
};

export const getUserRoomId = (id: string) => {
  return clients.find((client) => client.id === id)?.room ?? "";
};

export const updateClientAnswers = (socketId: string, answer: number) => {
  const client = clients.find((client) => client.id === socketId);
  if (!client) return;
  client["answers"].push(answer);
  return client;
};
