dev:
	docker compose up --build --remove-orphans

migration:
	goose -dir $(shell pwd)/database/migrations create $(NAME) sql

seed:
	goose -dir $(shell pwd)/database/seeds create $(NAME) sql

sql:
	sqlc generate
