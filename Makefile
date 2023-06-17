dev:
	docker compose up --build --remove-orphans

sql:
	sqlc generate
