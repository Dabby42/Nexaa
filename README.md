# Nexaa Platform API

## Description

This application is responsible for managing creators and influencers.

## Running the application

This application depends on a couple of services to run fully. The command below would build and start all dependent containers and take you into the bash temrinal of the main container:

$ ./bin/start_disposable.sh

## Installation

```bash
$ yarn install
```

## Starting this application

you will need to change the server listening part of the application to use:

```
app.listen(8000, '0.0.0.0')
```

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Technology used

[Fastify] (https://www.fastify.io/docs/)

[NestJS] (https://docs.nestjs.com/)
[TypeORM] (https://typeorm.io/#/)

## Test

### Framework Used

- [Jest] (https://jestjs.io/docs/en/getting-started)

You can run the test by using the following command:

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
