import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
};
