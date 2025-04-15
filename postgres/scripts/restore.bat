@echo off
set USER=arthur
set DB=pg
set CONTAINER=db
set BACKUP_FILE=backup_2025-04-15_10-22-35.sql

echo Restaurando o banco de dados...
docker exec -i %CONTAINER% psql -U %USER% -d %DB% < "../backups/%BACKUP_FILE%"

echo Banco de dados restaurado com sucesso a partir de: backups\%BACKUP_FILE%
pause
