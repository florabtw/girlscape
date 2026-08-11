/**
 * A type that may or may not be undefined.
 */
declare type Optional<T> = T | undefined;

/**
 * A type that may or may not be null.
 */
declare type Nullable<T> = T | undefined;

/**
 * A type that may or may not be a promise. Is this how you'd spell it? Idk.
 */
declare type Promiseable<T> = T | Promise<T>;

/**
 * A type that defines the structure of a module when it's lazy-loaded.
 * @template ModuleType The type of the module being loaded.
 */
declare type LazyLoaded<ModuleType> = { default: ModuleType };

// I'd prefer to put the following with the other discord declarations, but need them to be separate so these types stay ambient.

// #region Discord-specific ambient declarations.
/**
 * Defines the format discord expects commands to be in.
 */
declare interface CommandModule {
  /**
   * An event handler to define when the command data allows for autocompletion.
   * 
   * I'm too lazy to set up types to make this required when the `SlashCommandBuilder` chains into `setAutocomplete()`,
   * but there's probably a way and it's probably awesome.
   * @param interaction The interaction object provided by discord.
   */
  autocomplete?: (interaction: import("discord.js").Interaction) => Promiseable<void>;
  /**
   * Provides the command definition to register in discord.
   */
  data: import("discord.js").SharedSlashCommand; //  Imports are done like this to keep this as an ambient declaration.
  /**
   * Contains the functionality to run from our event handler when the command is used.
   * @param interaction The interaction object provided by discord.
   */
  execute: (interaction: import("discord.js").Interaction) => Promiseable<void>;
}
// #endregion