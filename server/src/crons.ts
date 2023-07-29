import cron from "node-cron";
import { firebaseArchiveRooms } from "../firebase/firebase";

export const scheduleArchiving = async () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const archivedRoom = await firebaseArchiveRooms();
      if (archivedRoom.length) console.log("Rooms archived successfully.", archivedRoom);
    } catch (error) {
      console.error("Error archiving rooms:", error);
    }
  });
};
