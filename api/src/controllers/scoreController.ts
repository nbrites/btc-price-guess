import { Request, Response } from "express";
import { getScore, upsertScore } from "../services/scoreService";

export const getScoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId as string;

  if (!userId) {
    res.status(400).json({ error: "UserId is required" });
    return;
  }

  try {
    const score = await getScore(userId);
    if (score) {
      res.status(200).json({ score });
    } else {
      res.status(200).json({ score: 0 });
    }
  } catch (error) {
    console.error("Error fetching score:", error);
    res.status(500).json({ error: "Error fetching score" });
  }
};

export const upsertScoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, score } = req.body;

  if (!userId || score === undefined) {
    res.status(400).json({ error: "UserId and score are required" });
    return;
  }

  try {
    const updateSuccessfull = await upsertScore(userId, score);
    if (updateSuccessfull) {
      res.status(200).json({
        message: "Score upserted successfully",
      });
    } else {
      res.status(500).json({ error: "Error upserting score" });
    }
  } catch (error) {
    console.error("Error upserting score:", error);
    res.status(500).json({ error: "Error upserting score" });
  }
};
