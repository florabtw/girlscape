import { REST, Routes } from "discord.js";

import loadCommands from "#utils/commandLoader.js";

import config from "./config.js";

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.discord.token);

// find/load commands
const commands = await loadCommands();

// and deploy your commands!
try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = (await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands.map((command) => command.data.toJSON())
  })) as ArrayLike<unknown>; // why tf doesnt discord type their methods properly

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}
