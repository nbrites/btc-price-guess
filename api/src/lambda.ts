import awsServerlessExpress from "aws-serverless-express";
import { app } from "./app";

const server = awsServerlessExpress.createServer(app);

export const handler = (event: any, context: any) => {
  console.log("Lambda handler started");
  try {
    return awsServerlessExpress.proxy(server, event, context);
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
