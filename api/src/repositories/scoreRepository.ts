import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamoDB, tableName } from "../db/dynamoDb";

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

  const unmarshalledItem = unmarshall(result.Item);
  return unmarshalledItem.value;
};
