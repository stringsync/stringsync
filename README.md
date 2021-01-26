# StringSync

[stringsync.com](https://stringsync.com)

StringSync is a web application that teaches people how to play guitar.

## Getting Started

### Prerequisites

StringSync uses Docker and `docker-compose` to run services locally. You will need this if you want to run StringSync locally.

- [install Docker](https://docs.docker.com/install/)
- [install docker-compose](https://docs.docker.com/compose/install/)

StringSync uses `yarn` as a package management solution. You will need this if you want to have TypeScript type definitions when updating the codebase.

- [install yarn](https://yarnpkg.com/lang/en/docs/install/)

Project dependencies can be installed by running the following command:

```
yarn setup
```

### Commands

StringSync commands are run using the `./bin/ss` command.

To view all the commands, run:

```
./bin/ss help
```

Before running the api for the first time, you will need to generate a secrets file (not tracked by .git):

```
./bin/ss gensecrets
```

The file it generates will have fake credentials, but this should be OK as long as you don't interact with dev AWS resources (such as uploading a file to AWS).

First, build the docker images. You only need to do this once:

```
./bin/ss build
```

To run the api, start Docker engine and run:

```
./bin/ss up
```

- http://localhost:8080 frontend UI
- http://localhost:3000/altair backend GraphQL query playground

To stop the api, run:

```
./bin/ss down
```

To run api tests in watch mode, run:

```
./bin/ss test api -w
```

To run the web project, run:

```
./bin/ss up web
```

To run web tests in watch mode, run:

```
./bin/ss test web -w
```

## VSCode Setup

StringSync was developed using VSCode. Project settings are stored in a `.vscode` directory, which is ignored by git. The recommended settings are:

`settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.packageManager": "yarn",
  "typescript.preferences.importModuleSpecifier": "relative",
  "javascript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```
