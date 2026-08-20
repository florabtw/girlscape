import type { Collection } from "discord.js";

declare module "discord.js" {
  /**
   * Augmentation for discord's `Client` class to include a typedef for the collection prop they suggest adding.
   *
   * Why do they ask the user to define this? Why can't they do it themselves? I don't understand.
   */
  export interface Client {
    /**
     * A collection of slash commands to register.
     */
    commands: Collection<string, CommandModule>;
  }
}
