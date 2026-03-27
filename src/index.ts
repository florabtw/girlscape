import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

import config from "#config";
import loadCommands from "#utils/commandLoader.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(config.discord.token);
client.commands = new Collection();

// me when the await is top level
const commands = await loadCommands();

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral
        });
      }
    }
  } else if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);

    try {
      // let the catch figure out how to handle these errors (just logs them at the time of this writing)
      if (!command) {
        throw new Error(`No command matching ${interaction.commandName} was found.`);
      }
      if (!command.autocomplete) {
        throw new Error(`Unable to find a matching autocomplete function for command (${interaction.commandName}).`);
      }
      // I assume we don't care about reporting missing function errors here, since it should always exist if we get to this point.
      await command.autocomplete?.(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});
