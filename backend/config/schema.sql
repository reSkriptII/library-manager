BEGIN;

DROP TABLE IF EXISTS books, authors, book_authors, genres, book_genres, users;
DROP TYPE IF EXISTS user_role;

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(book_id),
    author_id INTEGER REFERENCES authors(author_id),
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE
);

CREATE TABLE book_genres (
    book_id INTEGER REFERENCES books(book_id),
    genre_id INTEGER REFERENCES genres(genre_id),
    PRIMARY KEY (book_id, genre_id)
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