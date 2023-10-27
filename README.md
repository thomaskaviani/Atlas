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
Make sure the community edition of Flyway CLI is installed on the device
Make sure Git CLI is installed on the deviceB
The .env & flyway.conf file has to be present in the root folder on the machine we run this on.
```
rm -r -f atlas/ && git clone https://github.com/thomaskaviani/atlas.git && cp .env atlas/.env && cd atlas && flyway -locations=filesystem:opt/migrations -user=postgres -password=password -url=jdbc:postgresql://localhost:5432/postgres -driver=org.postgresql.Driver -cleanDisabled=false migrate && npm start
```

## Flyway CLI 

Make sure the community edition of flyway cli is installed on the device

run the following flyway command before startup app
```
 flyway -locations=filesystem:opt/migrations -user=postgres -password=password -url=jdbc:postgresql://localhost:5432/postgres -driver=org.postgresql.Driver -cleanDisabled=false migrate
```

