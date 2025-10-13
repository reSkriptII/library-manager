BEGIN;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT,
    author TEXT,
    availability BOOLEAN DEFAULT TRUE
);

COMMIT;