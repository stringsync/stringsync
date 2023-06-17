# stringsync

[stringsync.com](https://stringsync.com)

stringsync is a web application that teaches people how to play guitar.

## Database Migrations

Before running any of the commands, install [goose](https://github.com/pressly/goose).
All commands are intended to be run from the root directory of the project.

### migration

```shell
make migration NAME=create_users_table
```

>NOTE: After writing the migration, you also need to run `make sql` to regenerate
the go SQL client.

### seed

```shell
make seed NAME=create_users
```
