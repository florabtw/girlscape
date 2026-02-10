# GirlScape Discord Bot

Largely follows paradigms from discord.js getting started guide: https://discordjs.guide/legacy


## Dev Setup

Create your own discord bot in [Discord Developer Portal](https://discord.com/developers/applications).

From the OAuth2 page, create an invite url with "bot" scope, and "Send Messages"
text permissions, and invite your bot to a test server.

Copy `env.sample` to `.env` and fill in values from Developer portal, and your
local redis install.

### Run Locally

Starts Girlscape bot & Redis instance in a docker container.

```
./scripts/development.sh up
```

### Restart Bot

When you make code changes, restart discord bot to reload files.

```
docker compose restart girlscape
```

### Connect to Redis

Access redis instance to manually debug data.

```
./scripts/development.sh connect
```

## Deployment

Don't run this unless you are the repo administrator!

This will create a new repo version, create a new docker container, and push it
to Docker Hub.

```
npm version patch # or minor, major
./scripts/docker.sh deploy
```
