@echo off
set USER=arthur
set DB=pg
set CONTAINER=db
set DATE=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%
set DATE=%DATE: =0%

echo Gerando backup do banco de dados...
docker exec -t %CONTAINER% pg_dump -U %USER% -d %DB% > backups\backup_%DATE%.sql

echo Backup criado com sucesso em: backups\backup_%DATE%.sql
pause
