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

### Commands

StringSync commands are run using the `./bin/ss` command.

To view all the commands, run:

```
./bin/ss help
```

To run the project, start Docker engine and run:

```
./bin/ss up
```

- http://localhost:8080 frontend UI
- http://localhost:3000 backend GraphQL query playground

To stop the project, run:

```
./bin/ss down
```

## VSCode Setup

StringSync was developed using VSCode. Project settings are stored in a `.vscode` directory, which is ignored by git. The recommended settings are:

`settings.json`

```json
{
  "editor.formatOnSave": true,
  "eslint.enable": true,
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "eslint.packageManager": "yarn",
  "typescript.preferences.importModuleSpecifier": "relative",
  "javascript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

`tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "tsc server",
      "type": "process",
      "command": "yarn",
      "args": [
        "tsc",
        "--watch",
        "--noEmit",
        "--project",
        "server/tsconfig.json"
      ],
      "problemMatcher": ["$tsc"],
      "group": "build",
      "isBackground": true,
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "echo": false,
        "reveal": "never",
        "focus": false
      }
    },
    {
      "label": "tsc web",
      "type": "process",
      "command": "yarn",
      "args": ["tsc", "--watch", "--noEmit", "--project", "web/tsconfig.json"],
      "problemMatcher": ["$tsc"],
      "group": "build",
      "isBackground": true,
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "echo": false,
        "reveal": "never",
        "focus": false
      }
    }
  ]
}
```
