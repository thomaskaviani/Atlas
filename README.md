# Atlas

## NPM Installs
```
discord.js
@types/reflect-metadata
typescript
inversify
dotenv
@types/node
reflect-metadata
chai
mocha
ts-mockito
ts-node
@types/chai
@types/mocha
pg
sequelize
sequelize-typescript
timers-promises
express
@types/express
webpack-cli
```

Full command
```
npm install discord.js webpack-cli @types/reflect-metadata typescript inversify dotenv @types/node reflect-metadata chai mocha ts-mockito ts-node @types/chai @types/mocha pg sequelize sequelize-typescript timers-promises express @types/express
```

## Running the bot as developer

```
npx tsc && npm start
```

## Startup command for Rasberry Pi or other linux-based server device
The .env file has to be present on the machine we run this on.
This file needs to contain the following paramaters: 
DISCORD_TOKEN=
DISCORD_HOARD_CHANNEL_ID=
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_PORT=
DATABASE_NAME=
```
rm -r -f atlas/ && git clone https://github.com/thomaskaviani/atlas.git && cp .env atlas/.env && cd atlas && npm start
```
