dev:
	docker compose up --build --remove-orphans

migration:
	goose -dir $(shell pwd)/db/migrations create $(NAME) sql

seed:
	goose -dir $(shell pwd)/db/seeds create $(NAME) sql

sql:
	sqlc generate
