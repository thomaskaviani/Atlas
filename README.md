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
The .env & flyway.conf file has to be present in the root folder on the machine we run this on.
```
rm -r -f atlas/ && git clone https://github.com/thomaskaviani/atlas.git && cp .env atlas/.env && cp flyway.conf atlas/flyway.conf && cd atlas && flyway -configFile=flyway.conf migrate && npm start
```

## Flyway CLI 

Make sure a flyway.conf file is present in the root folder on the machine we run this on.

flyway.conf file:
```
flyway.locations=filesystem:opt/migrations/
flyway.driver=org.postgresql.Driver
flyway.url=jdbc:postgresql://localhost:5432/postgres
flyway.user=postgres
flyway.password=********
```

run the following flyway command before startup app
```
flyway -configFile=flyway.conf migrate
```

