import express from "express";
import cors from "cors";
import {
  getScoreHandler,
  upsertScoreHandler,
} from "./controllers/scoreController";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? "https://dnk5qap6lmzyn.cloudfront.net"
    : "http://localhost:3000";

app.options(
  "*",
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(express.json());

app.get("/scores/:userId", getScoreHandler);
app.post("/scores", upsertScoreHandler);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
