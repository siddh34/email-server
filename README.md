# Emailer

Swagger docs at `/api` endpoint

## Description

* Contains two email providers for emailing Resend and usePlunk
* Has a retry machanism
* Has status tracking of emails sent or not sent
* Has duplicate send prevention

## Project setup

local setup & start

```bash
pnpm install
pnpm run start
```

## Run on Docker

```bash
docker compose build
docker compose up -d
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

## Resources

* Build in [nestjs](https://docs.nestjs.com/)
* Read the [Resend docs](https://resend.com/docs/introduction)
* Read the [useplunk docs](https://www.useplunk.com/)