# Discord Bot Project

This project provides the structure for a Discord bot using the discord.js library, alongside MongoDB for database operations.

## Prerequisites

1. Ensure you have [Node.js](https://nodejs.org/) & [Bun](https://bun.sh/) installed on your machine.
2. You should have a [MongoDB](https://www.mongodb.com/) server running to handle database operations.
3. Create a [Discord application](https://discord.com/developers/applications) and add a bot to it. You can follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) for more information.

## Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:ManuelR-T/Discord-nose-bot.git discord-nose-bot
   cd discord-nose-bot
   ```

2. Install the required dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` by copying the `.env.example` file:

   ```bash
    cp .env.example .env
   ```

4. Fill in the required environment variables in the `.env` file.

## Available Scripts

- **Dev**: Starts the bot in development mode using nodemon and ts-node.

  ```bash
  bun run dev
  ```
- **Commands**: Updates the commands of the Discord bot. (This can take up to an hour to take effect.)

  ```bash
  bun run commands:update
  ```
- **Test**: Runs the tests.

  ```bash
  bun test
  ```

- **Lint**: Lints the codebase using ESLint with Prettier plugin.

  ```bash
  bun run lint:fix
  ```

## Libraries and Dependencies

- **Core**:

  - [discord.js](https://discord.js.org/): For interacting with the Discord API.
  - [dotenv](https://www.npmjs.com/package/dotenv): To load environment variables from a `.env` file.
  - [mongodb](https://www.npmjs.com/package/mongodb): MongoDB driver for Node.js.
  - [mongoose](https://mongoosejs.com/): Elegant MongoDB object modeling for Node.js.

- **Development**:
  - TypeScript, ESLint, Prettier: For type safety, linting, and code formatting respectively.

## Contributing

If you wish to contribute to the project, please follow the standard GitHub pull request process:

1. Fork the repository.
2. Create a new branch for your features or fixes.
3. Make your changes.
4. Push your changes to your fork.
5. Submit a pull request.
