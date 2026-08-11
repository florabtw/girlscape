declare namespace NodeJS {
    // Declaration merge for environment variables, so TS can autocomplete them.
    interface ProcessEnv {
        /**
         * The currently running node environment.
         */
        NODE_ENV: "production" | "development";
        /**
         * The private token for this bot.
         */
        DISCORD_TOKEN: string;

        /**
         * The public id number for this bot, assigned by discord.
         */
        CLIENT_ID: string;

        /**
         * The url of a running redis instance to use.
         */
        REDIS_URL: string;
    }
}