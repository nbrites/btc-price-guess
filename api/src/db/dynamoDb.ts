import {
  DynamoDBClient,
  CreateTableCommand,
  AttributeDefinition,
  KeySchemaElement,
  ProvisionedThroughput,
  DescribeTableCommand,
  DescribeTableCommandOutput,
} from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-central-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

export const tableName = process.env.DYNAMODB_TABLE_NAME || "ScoreTable";

export async function createScoreTableIfDoesNotExist() {
  const describeTableParams = {
    TableName: tableName,
  };

  let tableExists = false;

  try {
    const describeTableCommand = new DescribeTableCommand(describeTableParams);
    const describeTableResponse: DescribeTableCommandOutput =
      await dynamoDB.send(describeTableCommand);

    if (
      describeTableResponse.Table &&
      describeTableResponse.Table.TableStatus
    ) {
      tableExists = true;
    }
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log("Table does not exist, proceeding to create.");
    } else {
      console.error("Error describing table:", error);
      throw error;
    }
  }

  if (tableExists) {
    console.log("Table already exists. Skipping creation.");
    return;
  }

  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
    ] as AttributeDefinition[],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
    ] as KeySchemaElement[],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    } as ProvisionedThroughput,
  };

  try {
    const command = new CreateTableCommand(params);
    const data = await dynamoDB.send(command);
    console.log("Table creation initiated.");
    console.log("CreateTable response:", data);

    if (data.TableDescription && data.TableDescription.TableName) {
      console.log(
        "Score table created successfully:",
        data.TableDescription.TableName
      );
    } else {
      console.log("Unexpected response when creating the table:", data);
    }
    return data;
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

export { dynamoDB };
