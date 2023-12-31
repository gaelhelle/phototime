import { v4 as uuidv4 } from "uuid";

export const generateRoomCode = () => {
  const uuid = uuidv4();
  const code = uuid.substr(0, 6).toUpperCase();

  return code;
};

export const generateUniqueRandomNumbers = (max: number, limit: number) => {
  if (limit > max + 1) {
    throw new Error("Cannot generate more unique numbers than the range allows.");
  }

  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < limit) {
    const randomNumber = Math.floor(Math.random() * max);
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers) as number[];
};

export const calculateScore = (correctAnswer: number, clientAnswer: number) => {
  const maxScore = 100;
  const yearDifference = Math.abs(correctAnswer - clientAnswer);
  const score = Math.round(maxScore * Math.pow(0.25, yearDifference / 20));
  return Math.max(0, score);
};

// const getPhotos = async () => {
//   try {
//     const response: any = await fetch(`http://localhost:8080/server/get-photos`, { method: "GET" });
//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// };
