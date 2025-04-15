@echo off
set USER=arthur
set DB=pg
set CONTAINER=db

echo Dropping all tables from the database...
docker exec -t %CONTAINER% psql -U %USER% -d %DB% -c "DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE'; END LOOP; END $$;"

echo All tables dropped successfully from database: %DB%
pause
