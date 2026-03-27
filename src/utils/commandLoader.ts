import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";


// This is terrifying. We can just assume neither this file nor the commands folder will ever move, right? :')
const foldersPath = path.join(import.meta.dirname, "..", "commands");
const commandFolders = fs.readdirSync(foldersPath);

const isScriptFile = (file: string) => {
  return file.endsWith(".js") || file.endsWith(".ts");
};

/**
 * Dynamically finds and loads all command modules.
 */
const loadCommands = async () => {
  const commands: CommandModule[] = [];
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(isScriptFile);
    for (const file of commandFiles) {
      let filePath = path.join(commandsPath, file);
      // billy decided that windows needs to do everything annoyingly different, so add a file protocol at the beginning
      if (process.platform === "win32") {
        filePath = pathToFileURL(filePath).toString();
      }

      // wrapping import in a try/catch to make obscure errors a bit more obvious
      try {
        const { default: command } = await import(filePath) as LazyLoaded<CommandModule>;
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          commands.push(command);
        } else {
          console.warn(`The command at ${filePath} is missing a required "data" or "execute" property. Skipping.`);
        }
      } catch (err) {
          console.error(`Unable to load command from filepath "${filePath}".`, err);
      }
    }
  }
  return commands;
};

// Exporting after the fact to help editors find jsdoc comments. jsdoc is so flimsy and annoying i hate it
export default loadCommands;
