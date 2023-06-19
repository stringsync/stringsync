-- name: GetUser :one
SELECT *
FROM users
WHERE id = $1
LIMIT 1;

-- name: ListUsers :many
SELECT *
FROM users;

-- name: CreateUser :one
INSERT INTO users (id, username)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET username = $2
WHERE id = $1
RETURNING *;