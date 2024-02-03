# Instructions for running express server

-   cd server
-   follow instructions in .env.template
-   npm install
-   cd db
-   psql {connectionString} -f init.sql
-   psql {connectionString} -f seed.sql
-   cd ..
-   npm run start
