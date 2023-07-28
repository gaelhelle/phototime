import { doc, setDoc, serverTimestamp, collection, where, getDocs, query, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./config";

export const firebaseIsRoomAvailable = async (roomId: string) => {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnapshot = await getDoc(roomRef);

  return roomSnapshot.exists();
};

export const firebaseCreateRoom = (room: string) => {
  const roomRef = doc(db, "rooms", room);
  //   const now = serverTimestamp();
  const now = Date.now();

  setDoc(roomRef, { code: room, status: "pending", createdAt: now })
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
  const now = Date.now();
  const thirtyMinutesAgo = now - 30 * 60 * 1000;

  const roomsCollectionRef = collection(db, "rooms");
  const q = query(roomsCollectionRef, where("createdAt", "<", thirtyMinutesAgo));
  const querySnapshot = await getDocs(q);

  // Update the status of matching documents
  for (const docSnap of querySnapshot.docs) {
    const roomRef = doc(roomsCollectionRef.firestore, "rooms", docSnap.id);
    await updateDoc(roomRef, { status: "expired" });
  }
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
