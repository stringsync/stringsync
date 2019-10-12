scripts
=======

StringSync Scripts.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/scripts.svg)](https://npmjs.org/package/scripts)
[![Downloads/week](https://img.shields.io/npm/dw/scripts.svg)](https://npmjs.org/package/scripts)
[![License](https://img.shields.io/npm/l/scripts.svg)](https://github.com/jaredjj3/string-sync/blob/master/package.json)

<!-- toc -->
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
scripts/0.0.0 darwin-x64 node-v12.4.0
$ ss --help [COMMAND]
USAGE
  $ ss COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ss bounce`](#ss-bounce)
* [`ss down`](#ss-down)
* [`ss help [COMMAND]`](#ss-help-command)
* [`ss install [FILE]`](#ss-install-file)
* [`ss up`](#ss-up)

## `ss bounce`

Performs a hard reset on the development environment

```
USAGE
  $ ss bounce

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/bounce.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/bounce.ts)_

## `ss down`

Turns down a development environment

```
USAGE
  $ ss down

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/down.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/down.ts)_

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

## `ss install [FILE]`

describe the command here

```
USAGE
  $ ss install [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/install.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/install.ts)_

## `ss up`

Spins up a development environment

```
USAGE
  $ ss up

OPTIONS
  -a, --attach
  -h, --help    show CLI help
```

_See code: [src/commands/up.ts](https://github.com/jaredjj3/string-sync/blob/v0.0.0/src/commands/up.ts)_
<!-- commandsstop -->
