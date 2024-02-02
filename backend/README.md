# Instructions for running express app

-   cd backend
-   follow instructions in .env.template
-   npm install
-   cd database
-   psql -U {user_name} -d {database_name} < init.sql
-   psql -U {user_name} -d {database_name} < seed.sql
-   cd ..
-   npm run start
