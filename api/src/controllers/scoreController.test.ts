import request from "supertest";
import express from "express";
import { getScoreHandler, upsertScoreHandler } from "./scoreController";
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
app.post("/scores", upsertScoreHandler);

describe("Score Controller", () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = dynamoDB.send as jest.Mock;
    mockSend.mockClear();
  });

  describe("GET /scores/:userId", () => {
    it("should return 200 and the score for a valid userId", async () => {
      const userId = "user123";
      const expectedScore = 100;
      mockSend.mockResolvedValueOnce({
        Item: {
          userId: { S: userId },
          score: { N: expectedScore },
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

  describe("POST /scores", () => {
    it("should return 200 and a success message when score is upserted", async () => {
      const userId = "user123";
      const score = 150;
      mockSend.mockResolvedValueOnce({});

      const response = await request(app)
        .post("/scores")
        .send({ userId, score });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Score upserted successfully");
    });

    [
      {
        description: "missing userId",
        requestBody: { score: 150 },
        expectedStatus: 400,
        expectedError: "UserId and score are required",
      },
      {
        description: "missing score",
        requestBody: { userId: "user123" },
        expectedStatus: 400,
        expectedError: "UserId and score are required",
      },
    ].forEach(({ description, requestBody, expectedStatus, expectedError }) => {
      it(`should return ${expectedStatus} if ${description}`, async () => {
        const response = await request(app).post("/scores").send(requestBody);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.error).toBe(expectedError);
      });
    });

    it("should return 500 if an error occurs while upserting the score", async () => {
      const userId = "user123";
      const score = 150;
      mockSend.mockRejectedValueOnce(new Error("DynamoDB error"));

      const response = await request(app)
        .post("/scores")
        .send({ userId, score });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error upserting score" });
    });

    it("should handle an internal server error thrown by upsertScore", async () => {
      jest.mock("../services/scoreService", () => ({
        upsertScore: jest
          .fn()
          .mockRejectedValue(new Error("Database connection error")),
      }));

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const response = await request(app)
        .post("/scores")
        .send({ userId: "test-user", score: 10 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error upserting score" });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error upserting score:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
      jest.unmock("../services/scoreService");
    });
  });
});
