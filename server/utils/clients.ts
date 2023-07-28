export interface clientType {
  id: string;
  roomMaster?: boolean;
  room: string;
  name: string;
  avatar?: any;
}
export const clients: clientType[] = [];

export const clientJoin = ({ id, room, roomMaster, name, avatar }: clientType) => {
  const client = { id, room, roomMaster, name, avatar };
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

export const gerRoomUsers = (room: string) => {
  return clients.filter((client) => client.room === room);
};
