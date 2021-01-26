# scripts

StringSync Scripts.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/scripts.svg)](https://npmjs.org/package/scripts)
[![Downloads/week](https://img.shields.io/npm/dw/scripts.svg)](https://npmjs.org/package/scripts)
[![License](https://img.shields.io/npm/l/scripts.svg)](https://github.com/jaredjj3/string-sync/blob/master/package.json)

<!-- toc -->
* [scripts](#scripts)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g scripts
$ ss COMMAND
running command...
$ ss (-v|--version|version)
scripts/0.0.0 darwin-x64 node-v14.15.4
$ ss --help [COMMAND]
USAGE
  $ ss COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ss build`](#ss-build)
* [`ss db [PROJECT]`](#ss-db-project)
* [`ss down [PROJECT]`](#ss-down-project)
* [`ss exec PROJECT SERVICE CMD`](#ss-exec-project-service-cmd)
* [`ss gensecrets`](#ss-gensecrets)
* [`ss help [COMMAND]`](#ss-help-command)
* [`ss lint`](#ss-lint)
* [`ss logs PROJECT [SERVICE]`](#ss-logs-project-service)
* [`ss pretty`](#ss-pretty)
* [`ss productionize`](#ss-productionize)
* [`ss test PROJECT [CMD]`](#ss-test-project-cmd)
* [`ss typegen`](#ss-typegen)
* [`ss up [PROJECT]`](#ss-up-project)

## `ss build`

build docker images for stringsync

```
USAGE
  $ ss build

OPTIONS
  -c, --cmd
  -d, --dev
  -h, --help             show CLI help
  -p, --prod
  -t, --test
  --cacheFrom=cacheFrom
  --tag=tag              [default: latest]
```

_See code: [src/commands/build.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/build.ts)_

## `ss db [PROJECT]`

runs a db console

```
USAGE
  $ ss db [PROJECT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/db.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/db.ts)_

## `ss down [PROJECT]`

shutdown a development environment

```
USAGE
  $ ss down [PROJECT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/down.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/down.ts)_

## `ss exec PROJECT SERVICE CMD`

run a command against a container

```
USAGE
  $ ss exec PROJECT SERVICE CMD

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/exec.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/exec.ts)_

## `ss gensecrets`

create the secrets.env file needed for local development

```
USAGE
  $ ss gensecrets

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/gensecrets.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/gensecrets.ts)_

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

## `ss lint`

lints the entire project

```
USAGE
  $ ss lint

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/lint.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/lint.ts)_

## `ss logs PROJECT [SERVICE]`

tail logs for a particular service

```
USAGE
  $ ss logs PROJECT [SERVICE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/logs.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/logs.ts)_

## `ss pretty`

check the code formatting

```
USAGE
  $ ss pretty

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/pretty.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/pretty.ts)_

## `ss productionize`

update files for production

```
USAGE
  $ ss productionize

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/productionize.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/productionize.ts)_

## `ss test PROJECT [CMD]`

run stringsync tests

```
USAGE
  $ ss test PROJECT [CMD]

OPTIONS
  -c, --coverage
  -w, --watch
  --cacheFrom=cacheFrom
  --ci
```

_See code: [src/commands/test.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/test.ts)_

## `ss typegen`

generate typescript types for graphql schema

```
USAGE
  $ ss typegen

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/typegen.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/typegen.ts)_

## `ss up [PROJECT]`

spins up a development environment

```
USAGE
  $ ss up [PROJECT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/up.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/up.ts)_
<!-- commandsstop -->
