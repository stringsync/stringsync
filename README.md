# stringsync

[stringsync.com](https://stringsync.com)

stringsync is a web application that teaches people how to play guitar.

## Getting Started

### Prerequisites

stringsync uses Docker and `docker-compose` to run services locally. You will need this if you want to run stringsync locally.

- [install Docker](https://docs.docker.com/install/)
- [install docker-compose](https://docs.docker.com/compose/install/)

stringsync uses `yarn` as a package management solution. You will need this if you want to have TypeScript type definitions when updating the codebase.

- [install yarn](https://yarnpkg.com/lang/en/docs/install/)

Project dependencies can be installed by running the following command in the project directory:

```
yarn install
```

### Commands

stringsync commands are run using the `./bin/ss` command.

To view all the commands, run:

```
./bin/ss
```

Before running the api for the first time, you will need to generate a secrets file (not tracked by .git):

```
./bin/ss gensecrets
```

The file it generates will have fake credentials, but this should be OK as long as you don't interact with dev AWS resources (such as uploading a file to AWS).

To run the api, start Docker engine and run:

```
./bin/ss dev
```

- http://localhost frontend UI
- http://localhost/altair backend GraphQL query playground

Press Ctrl + C to exit. The command should teardown the environment.

To teardown manually, run:

```
./bin/ss down
```

To run api tests in watch mode, run:

```
WATCH=true ./bin/ss testapi
```

To run web tests in watch mode, run:

```
WATCH=true ./bin/ss testweb
```
