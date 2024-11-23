const { createScoreTableIfDoesNotExist } = require("../dist/db/dynamoDb");

async function run() {
  try {
    await createScoreTableIfDoesNotExist();
  } catch (error) {
    console.error("Error creating Score table:", error);
  }
}

run();