
# Bitcoin Price Guess Game

![Deploy Frontend](https://github.com/nbrites/btc-price-guess/actions/workflows/deploy-frontend.yml/badge.svg) ![Deploy API](https://github.com/nbrites/btc-price-guess/actions/workflows/deploy-api.yml/badge.svg)

## Overview

The Bitcoin Price Guess Game is a simple web app that allows users to guess whether the market price of Bitcoin (BTC/USD) will go higher or lower after one minute. Players can make guesses based on the latest available BTC price in USD and are awarded points based on whether their guesses are correct or incorrect.

## Features

- **Current Score & BTC Price:** Players can always see their current score and the latest BTC price in USD.
- **Make a Guess:** Players can guess whether the BTC price will go higher or lower after one minute.
- **Guess Resolution:** The guess is resolved after at least 60 seconds, and the score is updated based on whether the guess was correct or not.
- **Score Persistence:** The score is saved in the backend, so players can return to their game later.

## System Architecture

### Frontend

- **React:** The frontend is built using React with TypeScript to ensure type safety and a modular, maintainable architecture.
- **TailwindCSS:** TailwindCSS is used for styling the application. It offers utility-first CSS classes, which makes it faster to build custom designs and ensures the app is responsive across all devices.

### API

- **Node.js + Express:** The API is built using Node.js with Express. This allows for rapid development of a RESTful API with a large set of available libraries and frameworks.
- **TypeScript:** TypeScript is used in the API to ensure static typing, which helps in catching errors early and improving code quality and maintainability.

### Cloud Infrastructure (AWS)

- **AWS S3:** The frontend is hosted as a static website using S3 and CloudFront. This allows for low-cost, highly scalable, and reliable hosting of the web app.
- **AWS API Gateway:** The API Gateway manages the REST API endpoints and connects them to the Lambda function.
- **AWS Lambda:** The API backend is deployed using AWS Lambda to run serverless functions in response to HTTP requests.
- **AWS DynamoDB:** DynamoDB is used for persistent storage of player scores. Being a a fully managed, NoSQL database it can scale automatically and handle high traffic efficiently.
- **AWS SAM:** AWS Serverless Application Model (SAM) is used to deploy the backend infrastructure, including  API Gateway, Lambda function, and DynamoDB. This simplifies deployment and reduces the need for manual configuration.

## Game Logic and Core Decisions

### Game State Management

- The game is designed using React's `useState` and `useEffect` hooks to manage the state of the game.
- A timer is employed using the `react-timer-hook` package to track the countdown for each round, ensuring that the game flow is synchronized and players can make guesses only within the allowed duration.

### Price Fetching

- The current Bitcoin price is fetched from the Coinbase API using a custom hook (`useBTCPrice`). This ensures that the game always reflects the latest market prices.
- The price at the time of the player's guess is stored to compare with the final price once the round ends, determining whether the guess was correct.

### Player’s Guess

- Players can guess whether the price will go "up" or "down". Once a guess is made, the game enters an active state where the guess is locked, and no further guesses can be made until the result is determined after the timer expires.
- The core decision here is to ensure that each guess is only resolved after the round ends, maintaining fairness in the game mechanics.

### Game Result Calculation

- At the end of each round, the result is determined by comparing the price at the time of the guess with the final price.
- If the player's guess was correct, they gain a point; if incorrect, they lose a point (but the score cannot go below zero). In the case of a draw (no price change), no points are awarded.
- The result is communicated to the player with dynamic status messages (Win, Loss, or Draw).

### Score Persistence

- Player scores are stored in a backend database (DynamoDB) via API calls to persist the user's progress across sessions.
- A fallback mechanism is in place to handle errors, such as failing to update the score due to connectivity or server issues.

### User Interface

- The UI shows the current Bitcoin price, the player's score, and the remaining time for each round. It also provides a message status to indicate whether the player’s guess is on track, off track, or still waiting for a price update.
- The `GuessButtons` component ensures that players can only make one guess per round, and the buttons are disabled once a guess is made to prevent multiple guesses within the same round.

## How to Run the Application

### Environment Variables

**Frontend**

The frontend requires the following environment variables. These should be added to a .env file in the root of your frontend project:

```env
REACT_APP_BTC_PRICE_URL=https://api.coinbase.com/v2/prices/spot?currency=USD
REACT_APP_BTC_GUESS_GAME_DURATION_MILLISECONDS=30000
REACT_APP_API_BASE_URL=http://localhost:8081
```

**API**

The API requires the following environment variables. These should be added to a .env file in the root of your API project:

```env
DYNAMODB_TABLE_NAME=ScoreTable
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Running locally

In the root of the project there is a ```docker-compose.yaml``` file that will spin up the frontend, the API and the DynamoDB instance. Run the following command to build and start:

```bash
docker compose --build -d
```

Once everything is up and running go to http://localhost:3000.

## Deployment

The frontend is deployed on AWS S3 and CloudFront for fast, globally distributed delivery. The backend is hosted using AWS Lambda with API Gateway and DynamoDB for storage.

Once deployed, the web app can be accessed through the CloudFront URL, and the API is available through the API Gateway URL.

### Continuous Integration and Deployment (CI/CD)

To streamline deployment, the project uses GitHub Actions with separate pipelines for the frontend and API. Each pipeline runs independently, ensuring isolated workflows:

- **Frontend Pipeline (deploy-frontend.yml):** Automatically builds the React app, deploys the static files to AWS S3, and invalidates the CloudFront cache to serve the latest version globally.
- **Backend Pipeline (deploy-api.yml):** Builds and deploys the Node.js + Express into a Lambda function using AWS SAM, configuring API Gateway and DynamoDB as part of the process.

This separation allows for independent updates to the frontend and backend API, minimizing downtime during deployments.

### Accessing the Application

Once deployed:

- The frontend can be accessed through the [CloudFront URL](https://dnk5qap6lmzyn.cloudfront.net/).
- The backend API is available via the API Gateway URL.

This setup ensures that the application is optimized for performance, scalability, and maintainability, with smooth deployment and automated CI/CD pipelines that separate concerns between the frontend and backend API.