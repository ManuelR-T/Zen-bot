# Discord Bot Project

This project provides the structure for a Discord bot using the discord.js library, alongside MongoDB for database operations.

## Prerequisites

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. You should have a [MongoDB](https://www.mongodb.com/) server running to handle database operations.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url> discord-nose-bot
   ```

2. Navigate to the project directory:
   ```bash
   cd discord-nose-bot
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file at the root of the project to store your environment variables. For example:
   ```bash
   DISCORD_TOKEN=YOUR_DISCORD_TOKEN
   MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
   ```

## Available Scripts

- **Build**: Compiles the TypeScript files.
  ```bash
  npm run build
  ```

- **Start**: Runs the compiled JavaScript code.
  ```bash
  npm start
  ```

- **Fast**: Removes the `dist` directory, compiles the TypeScript files, and then runs the bot.
  ```bash
  npm run fast
  ```

- **Dev**: Starts the bot in development mode using nodemon and ts-node.
  ```bash
  npm run dev
  ```

- **Lint**: Lints the codebase using ESLint.
  ```bash
  npm run lint
  ```

- **Prettier**: Formats the codebase using Prettier.
  ```bash
  npm run prettier
  ```

## Libraries and Dependencies

- **Core**:
  - [discord.js](https://discord.js.org/): For interacting with the Discord API.
  - [dotenv](https://www.npmjs.com/package/dotenv): To load environment variables from a `.env` file.
  - [mongodb](https://www.npmjs.com/package/mongodb): MongoDB driver for Node.js.
  - [mongoose](https://mongoosejs.com/): Elegant MongoDB object modeling for Node.js.

- **Development**:
  - [nodemon](https://www.npmjs.com/package/nodemon): Utility to monitor changes in your source and automatically restart your server.
  - TypeScript, ESLint, Prettier: For type safety, linting, and code formatting respectively.

## Contributing

If you wish to contribute to the project, please follow the standard GitHub pull request process:

1. Fork the repository.
2. Create a new branch for your features or fixes.
3. Make your changes.
4. Push your changes to your fork.
5. Submit a pull request.

