import fs from "node:fs";
import process from "node:process";

/**
 * Injects variables for the appropriate environment into `process.env`.
 * @param fallback Fallback to a base .env file if an environment-specific one isn't found.
 */
export const injectEnv = (fallback = false) => {
  const prod = process.env.NODE_ENV === "production";
  const baseEnv = ".env";
  let envFile = `${baseEnv}${prod ? ".prod" : ""}`;
  // If fallback is false, the expensive fs call will short-circuit to avoid perf loss.
  if (fallback && fs.existsSync(envFile)) {
    envFile = baseEnv;
  }
  process.loadEnvFile(envFile);
}

/**
 * Reinjects the environment if the provided variable names aren't found.
 * @param varNames The environment variables to look for.
 */
const ensureVars = (...varNames: Array<keyof NodeJS.ProcessEnv>) => {
  for (const varName of varNames) {
    if (!(varName in process.env)) {
      injectEnv();
    }
  }
}

// getters here allow env auto-injection in a way thats transparent to consumers of this module
export default {
  get discord() {
    ensureVars("DISCORD_TOKEN", "CLIENT_ID");
    return {
      token: process.env.DISCORD_TOKEN,
      clientId: process.env.CLIENT_ID
    }
  },
  get redis() {
    ensureVars("REDIS_URL");
    return {
      url: process.env.REDIS_URL
    }
  }
};
