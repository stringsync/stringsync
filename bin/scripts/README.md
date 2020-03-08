# scripts

StringSync Scripts.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/scripts.svg)](https://npmjs.org/package/scripts)
[![Downloads/week](https://img.shields.io/npm/dw/scripts.svg)](https://npmjs.org/package/scripts)
[![License](https://img.shields.io/npm/l/scripts.svg)](https://github.com/jaredjj3/string-sync/blob/master/package.json)

<!-- toc -->

- [scripts](#scripts)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g scripts
$ ss COMMAND
running command...
$ ss (-v|--version|version)
scripts/0.0.0 darwin-x64 node-v13.5.0
$ ss --help [COMMAND]
USAGE
  $ ss COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ss build [FILE]`](#ss-build-file)
- [`ss db`](#ss-db)
- [`ss down [PROJECT]`](#ss-down-project)
- [`ss exec PROJECT SERVICE CMD`](#ss-exec-project-service-cmd)
- [`ss help [COMMAND]`](#ss-help-command)
- [`ss install`](#ss-install)
- [`ss lint`](#ss-lint)
- [`ss logs PROJECT [SERVICE]`](#ss-logs-project-service)
- [`ss pretty`](#ss-pretty)
- [`ss sql CMD`](#ss-sql-cmd)
- [`ss sync-common`](#ss-sync-common)
- [`ss test PROJECT`](#ss-test-project)
- [`ss up [PROJECT]`](#ss-up-project)

## `ss build [FILE]`

describe the command here

```
USAGE
  $ ss build [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/build.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/build.ts)_

## `ss db`

Runs a db console.

```
USAGE
  $ ss db

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/db.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/db.ts)_

## `ss down [PROJECT]`

Turns down a docker-compose environment.

```
USAGE
  $ ss down [PROJECT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/down.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/down.ts)_

## `ss exec PROJECT SERVICE CMD`

Runs docker-compose exec on an running container.

```
USAGE
  $ ss exec PROJECT SERVICE CMD

OPTIONS
  -T, --psuedoTty
  -h, --help       show CLI help
```

_See code: [src/commands/exec.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/exec.ts)_

## `ss help [COMMAND]`

display help for ss

```
USAGE
  $ ss help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `ss install`

Reinstalls node_modules throughout the project.

```
USAGE
  $ ss install

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/install.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/install.ts)_

## `ss lint`

Lints the entire project (except node_modules).

```
USAGE
  $ ss lint

OPTIONS
  -h, --help           show CLI help
  -s, --gitStagedOnly
```

_See code: [src/commands/lint.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/lint.ts)_

## `ss logs PROJECT [SERVICE]`

Follows the logs for a particular service.

```
USAGE
  $ ss logs PROJECT [SERVICE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/logs.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/logs.ts)_

## `ss pretty`

describe the command here

```
USAGE
  $ ss pretty

OPTIONS
  -f, --fix
  -h, --help           show CLI help
  -s, --gitStagedOnly
```

_See code: [src/commands/pretty.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/pretty.ts)_

## `ss sql CMD`

Runs sequelize commands on a running server service.

```
USAGE
  $ ss sql CMD

OPTIONS
  -h, --help       show CLI help
  -n, --name=name
```

_See code: [src/commands/sql.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/sql.ts)_

## `ss sync-common`

Copies the common dir to all the projects.

```
USAGE
  $ ss sync-common

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/sync-common.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/sync-common.ts)_

## `ss test PROJECT`

describe the command here

```
USAGE
  $ ss test PROJECT

OPTIONS
  -w, --watch
```

_See code: [src/commands/test.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/test.ts)_

## `ss up [PROJECT]`

Spins up a development environment

```
USAGE
  $ ss up [PROJECT]

OPTIONS
  -a, --attach
  -h, --help    show CLI help
```

_See code: [src/commands/up.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/up.ts)_

<!-- commandsstop -->
