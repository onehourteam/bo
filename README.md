Backend for OneHour app
===

# Install

```
npm install
```

# Run

## Run using docker compose

```
docker-compose up
```

## Run separately

Start server

```
DEBUG=app:* npm start
```

Run test

```
npm test
```

Migrate database

```
./node_modules/db-migrate/bin/db-migrate up
```