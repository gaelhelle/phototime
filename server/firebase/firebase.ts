import { doc, setDoc, collection, where, getDocs, query, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "./config";
import { generateUniqueRandomNumbers } from "../utils/utils";

export const firebaseIsRoomAvailable = async (roomId: string) => {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnapshot = await getDoc(roomRef);

  return roomSnapshot.exists();
};

export const firebaseCreateRoom = (room: string, data?: any) => {
  const roomRef = doc(db, "rooms", room);
  //   const now = serverTimestamp();
  const now = Date.now();

  setDoc(roomRef, { code: room, status: "pending", createdAt: now, ...data })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.error("Error creating room:", err);
      throw new Error("Failed to create room: " + err.message);
    });
};

export const firebaseUpdateRoomStatus = async (roomId: string, status: string) => {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, { status: "started" });
};

export const firebaseArchiveRooms = async () => {
  let response = [];
  const now = Date.now();
  const thirtyMinutesAgo = now - 30 * 60 * 1000;

  const roomsCollectionRef = collection(db, "rooms");
  // const q = query(roomsCollectionRef, where("createdAt", "<", thirtyMinutesAgo), where("status", "!=", "expired"));
  const q = query(roomsCollectionRef, where("status", "!=", "expired"));
  const querySnapshot = await getDocs(q);

  response = querySnapshot.docs.map((doc) => doc.id);

  // Update the status of matching documents
  for (const docSnap of querySnapshot.docs) {
    const roomRef = doc(roomsCollectionRef.firestore, "rooms", docSnap.id);
    await updateDoc(roomRef, { status: "expired" });
  }

  return response;
};

export async function handleJoinRoom(socket: any, roomId: string, userId: string, userName: string) {
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);
    if (!roomSnapshot.exists()) return;

    const roomData = roomSnapshot.data();

    const users = roomData.users || [];
    const roomMaster = Boolean(!users.length);
    const userExists = users.some((user: any) => user.userId === userId);

    if (userExists) return;

    await updateDoc(roomRef, {
      users: arrayUnion({ userId, userName, roomMaster: roomMaster, socketId: socket.id }),
    });
  } catch (error) {
    throw error;
  }
}

export async function handleLeaveRoom(socket: any, roomId: string) {
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);
    if (!roomSnapshot.exists()) return;

    const roomData = roomSnapshot.data();

    const users = roomData.users;
    const newUsers = users.filter((user: any) => user.socketId !== socket.id);

    await updateDoc(roomRef, {
      users: newUsers,
    });
  } catch (error) {
    throw error;
  }
}

export async function firebaseGetUsers(roomId: string) {
  try {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnapshot = await getDoc(roomRef);
    if (!roomSnapshot.exists()) return;

    const roomData = roomSnapshot.data();

    const users = roomData.users;

    return users;
  } catch (error) {
    throw error;
  }
}

export async function firebaseGetPhotos(limit = 5) {
  let randomPhotos: any = [];

  try {
    const photosCollectionRef = collection(db, "photos");
    const totalPhotos = await getDocs(photosCollectionRef);
    const randomPhotoIds: number[] = generateUniqueRandomNumbers(totalPhotos.size, limit);
    randomPhotos = randomPhotoIds.map((id) => totalPhotos.docs[id]?.data());

    return randomPhotos;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
