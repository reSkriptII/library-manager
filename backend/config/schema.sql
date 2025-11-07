BEGIN;

DROP MATERIALIZED VIEW IF EXISTS book_details;
DROP TABLE IF EXISTS books, authors, book_authors, genres, book_genres, 
    book_series, users, lends,reservations CASCADE;
DROP TYPE IF EXISTS user_role;

/* **********************************************************************
 * User
 */

CREATE TYPE user_role AS ENUM ('member', 'librarian', 'admin');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    create_at TIMESTAMP DEFAULT NOW()
);

/* **********************************************************************
 * Book data 
 */

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

-- book authors
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    author_name TEXT UNIQUE
);

CREATE TABLE book_authors (
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- genres
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE
);

CREATE TABLE book_genres (
    book_id INTEGER  NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

/* **********************************************************************
 * loans and reservations
 */
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE RESTRICT,
    book_id INTEGER NOT NULL REFERENCES books (book_id) ON DELETE RESTRICT,
    borrow_time TIMESTAMP NOT NULL DEFAULT NOW(),
    due_date TIMESTAMP DEFAULT NOW() + INTERVAL '10 days',
    return_time TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE reservations (
    reserve_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reserve_time TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (book_id, user_id)
);
/* **********************************************************************
 * views
 */

CREATE MATERIALIZED VIEW book_details AS
    SELECT books.book_id as id, books.title,
        a.genre_ids, a.genre_names, b.author_ids, b.author_names
    FROM books
    LEFT JOIN 
        (SELECT book_id, array_agg(genres.genre_id) as genre_ids,
            array_agg(genre_name) as genre_names
        FROM book_genres bg
            JOIN genres ON bg.genre_id = genres.genre_id
            GROUP BY book_id
        ) a ON books.book_id = a.book_id
    LEFT JOIN 
        (SELECT book_id, array_agg(authors.author_id) as author_ids,
            array_agg(author_name) as author_names
        FROM book_authors ba
            JOIN authors ON ba.author_id = authors.author_id
            GROUP BY book_id
        ) b ON books.book_id = b.book_id;

COMMIT;