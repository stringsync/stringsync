dev:
	docker compose up --build --remove-orphans --renew-anon-volumes

migration:
	goose -dir $(shell pwd)/database/migrations create $(NAME) sql

seed:
	goose -dir $(shell pwd)/database/seeds create $(NAME) sql

sql:
	sqlc generate

test:
	docker compose --file docker-compose.test.yml up --build --remove-orphans --renew-anon-volumes --exit-code-from test
