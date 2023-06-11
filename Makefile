dev:
	docker compose up --build --remove-orphans

migrate:
	goose -dir db/migrations -table _db_version postgres \
		'postgresql://$POSTGRES_USER@db' up

seed:
	goose -dir db/seeds -table _db_seeds postgres '$(DSN)' up
