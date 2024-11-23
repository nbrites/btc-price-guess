import {
  getScoreByUserId,
  upsertScoreByUserId,
} from "../repositories/scoreRepository";

export const getScore = async (userId: string): Promise<Number | null> => {
  console.log(`Score service get score for user: ${userId}`);
  return await getScoreByUserId(userId);
};

export const upsertScore = async (
  userId: string,
  score: number
): Promise<boolean> => {
  console.log(`Score service upsert score ${score} for user ${userId}`);
  return await upsertScoreByUserId(userId, score);
};
