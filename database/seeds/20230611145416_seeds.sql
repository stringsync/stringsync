-- +goose Up
-- +goose StatementBegin
INSERT INTO users (id, username)
VALUES (1, 'Alice'),
  (2, 'Bob'),
  (3, 'Charlie'),
  (4, 'Dave');
-- +goose StatementEnd
