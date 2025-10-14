BEGIN;

DROP TABLE IF EXISTS books, users;

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULl,
    hashed_password TEXT NOT NULL,
    is_libralian BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

COMMIT;