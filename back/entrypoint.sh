#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z $DB_HOST $DB_PORT; do
    sleep 0.1
done
echo "PostgreSQL started"

python3 manage.py makemigrations
python3 manage.py migrate

if [ "$DEBUG" = "1" ]; then
    echo "Starting development server..."
    python3 manage.py runserver 0.0.0.0:8000
else
    echo "Starting production server..."
    gunicorn back.wsgi:application --bind 0.0.0.0:8000 --workers 4 --reload
fi