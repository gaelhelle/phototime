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
