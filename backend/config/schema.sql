BEGIN;

DROP TABLE IF EXISTS books, users;
DROP TYPE IF EXISTS user_role;

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    availability BOOLEAN DEFAULT TRUE
);

CREATE TYPE user_role AS ENUM ('user', 'librarian', 'admin');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULl,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user'
);

COMMIT;