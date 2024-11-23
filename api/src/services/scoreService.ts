import { getScoreByUserId } from "../repositories/scoreRepository";

export const getScore = async (userId: string): Promise<Number | null> => {
  console.log(`Score service get score for user: ${userId}`);
  return await getScoreByUserId(userId);
};
