import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamoDB, tableName } from "../db/dynamoDb";
import { UserScore } from "../models/userScoreModel";

export const getScoreByUserId = async (
  userId: string
): Promise<Number | null> => {
  const params = {
    TableName: tableName,
    Key: {
      userId: { S: userId },
    },
  };

  const command = new GetItemCommand(params);
  const result = await dynamoDB.send(command);

  if (!result || !result.Item) {
    return null;
  }

  const userScore = unmarshall(result.Item) as UserScore;
  return userScore.score;
};

export const upsertScoreByUserId = async (
  userId: string,
  score: number
): Promise<boolean> => {
  const params = {
    TableName: tableName,
    Item: {
      userId: { S: userId },
      score: { N: score.toString() },
    },
  };

  const command = new PutItemCommand(params);
  return dynamoDB
    .send(command)
    .then(() => {
      console.log("Item upserted successfully");
      return true;
    })
    .catch((err) => {
      console.error("Error upserting item:", err);
      return false;
    });
};
