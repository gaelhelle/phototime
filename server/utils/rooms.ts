import { clients, getRoomClients } from "./clients";

export interface photoType {
  url: string;
  year: string;
}
export interface settingsType {
  max: number;
}
export interface roomType {
  id: string;
  settings: settingsType;
  photos: photoType[];
}
export const rooms: roomType[] = [];

export const getRoomDetails = (id: string) => {
  const room = rooms.find((room) => room.id === id);
  return room;
};

export const addRoom = ({ id, settings, photos }: roomType) => {
  const room = { id, settings, photos };
  rooms.push(room);
  return room;
};

export const deleteRoom = (id: string) => {
  const index = rooms.findIndex((room) => room.id === id);
  const room = rooms.find((room) => room.id === id);

  if (index !== -1) {
    rooms.splice(index, 1);
  }

  return room;
};

export const isGameFinished = (roomId: string) => {
  const clients = getRoomClients(roomId);
  const roomMax = rooms.find((room) => room.id === roomId)?.settings.max;

  let isGameFinished = true;

  clients.forEach((client) => {
    console.log(client.answers.length);
    console.log(roomMax);
    console.log("====");

    if (client.answers.length !== roomMax) isGameFinished = false;
  });
  return isGameFinished;
};
