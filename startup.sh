npm install &&
  touch /home/atlas/Desktop/npm_installed_$(date +"%FT%H%M").txt &&
  npm run flyway-migrate &&
  touch /home/atlas/Desktop/flyway_migrated_$(date +"%FT%H%M").txt &&
  npx tsc &&
  touch /home/atlas/Desktop/build_succeeded_npm_started_$(date +"%FT%H%M").txt &&
  npm start
