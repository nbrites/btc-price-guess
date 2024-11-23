import request from "supertest";
import express from "express";

import { getScoreHandler } from "./scoreController";
import { dynamoDB } from "../db/dynamoDb";

jest.mock("../db/dynamoDb", () => ({
  ...jest.requireActual("../db/dynamoDb"),
  dynamoDB: {
    send: jest.fn(),
  },
}));

const app = express();
app.use(express.json());

app.get("/scores/:userId", getScoreHandler);

describe("Score Controller", () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = dynamoDB.send as jest.Mock;
    mockSend.mockReset();
  });

  it("should return 200 and the score for a valid userId", async () => {
    const userId = "user123";
    const expectedScore = 100;
    mockSend.mockResolvedValueOnce({
      Item: {
        userId: { S: userId },
        value: { N: `${expectedScore}` },
      },
    });

    const response = await request(app).get(`/scores/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(expectedScore);
  });

  it("should return 200 with score 0 when no score is found", async () => {
    const userId = "user123";
    mockSend.mockResolvedValueOnce({});

    const response = await request(app).get(`/scores/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(0);
  });

  it("should return 404 if userId is missing", async () => {
    const response = await request(app).get("/scores/");

    expect(response.status).toBe(404);
  });

  it("should return 500 if an error occurs while fetching the score", async () => {
    const userId = "user123";
    mockSend.mockRejectedValueOnce(new Error("DynamoDB error"));

    const response = await request(app).get(`/scores/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error fetching score" });
  });
});
