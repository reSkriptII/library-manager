BEGIN;

DROP TABLE IF EXISTS books, authors, book_authors, genres, book_genres, 
    book_series, users, borrow_records,reservations;
DROP TYPE IF EXISTS user_role;

CREATE TYPE user_role AS ENUM ('user', 'librarian', 'admin');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULl,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user'
);

CREATE TABLE book_series (
    series_id SERIAL PRIMARY KEY,
    series_name TEXT
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    series_id INTEGER NULL REFERENCES book_series (series_id) ON DELETE SET NULL
);

CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE
);

CREATE TABLE book_genres (
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE borrow_records (
    borrow_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    book_id INTEGER,
    borrow_time TIMESTAMP DEFAULT NOW(),
    due_date DATE DEFAULT NOW() + INTERVAL '10 days',
    return_time TIMESTAMP NULL DEFAULT NULL,
    returned BOOLEAN DEFAULT FALSE,
    late_return BOOLEAN DEFAULT NULL,
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id)
        REFERENCES  users (user_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_book_id
        FOREIGN KEY (book_id)
        REFERENCES books (book_id)
        ON DELETE RESTRICT
);

CREATE TABLE reservations (
    reserve_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reserve_time TIMESTAMP DEFAULT NOW()
);

COMMIT;