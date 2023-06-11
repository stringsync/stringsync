dev:
	docker compose up --build --remove-orphans

migrate:
	goose -dir db/migrations -table _db_version postgres up

seed:
	goose -dir db/seeds -table _db_seeds postgres up

sql:
	sqlc generate
