import { readFileSync } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const schemaPath = path.join(import.meta.dirname, "schema.sql");
const schema = readFileSync(schemaPath, { encoding: "utf-8" });

const client = new Client();
await client.connect();

await client.query(schema);
console.log("successfully create posgreSQL database");

await populateUserTable();
await populateBookData();
console.log("successfully insert sample data");

client.end();

async function populateUserTable() {
  const users = [
    {
      name: "user",
      email: "user@test.com",
      password: "user1234",
    },
    {
      name: "librarian",
      email: "librarian@test.com",
      password: "librarian1234",
    },
    {
      name: "admin",
      email: "admin@test.com",
      password: "admin1234",
    },
  ];

  for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);

    await client.query(
      `INSERT INTO users (name, email, hashed_password, role)
        VALUES ($1, $2, $3, $4)`,
      [user.name, user.email, hashedPassword, user.name]
    );
  }
}

async function populateBookData() {
  const books = [
    {
      title: "Math101",
      authors: ["Robert O"],
      genres: ["textbook", "math"],
    },
    {
      title: "The com inc.",
      authors: ["David Park"],
      genres: ["economy"],
    },
    {
      title: "Wild animal",
      authors: ["Jack Smith", "Thomas Williams"],
      genres: ["biology", "animal"],
    },
    {
      title: "Blue Man: Another day",
      authors: ["A. B. Cecily"],
      genres: ["comic"],
    },
    {
      title: "Introduction to physics",
      authors: ["Robert O"],
      genres: ["textbook", "physics"],
    },
    {
      title: "Cat raising handbook",
      authors: ["Thomas Williams", "David Park"],
      genres: ["animal"],
    },
  ];

  const authors = books.reduce((list, book) => {
    for (const author of book.authors) {
      if (!list.includes(author)) {
        list.push(author);
      }
      return list;
    }
  }, []);

  const genres = books.reduce((list, book) => {
    for (const genre of book.genres) {
      if (!list.includes(genre)) {
        list.push(genre);
      }
    }
    return list;
  }, []);

  for (const author of authors) {
    await client.query("INSERT INTO authors (name) VALUES ($1)", [author]);
  }
  for (const genre of genres) {
    await client.query("INSERT INTO genres (genre_name) VALUES ($1)", [genre]);
  }

  for (const book of books) {
    const bookInsertResult = await client.query(
      "INSERT INTO books (title) VALUES ($1) RETURNING book_id",
      [book.title]
    );
    const bookId = bookInsertResult.rows[0].book_id;

    for (const author of book.authors) {
      await client.query(
        `INSERT INTO book_authors (book_id, author_id)
          VALUES (
            $1, 
            (SELECT author_id FROM authors WHERE name = $2)
          )`,
        [bookId, author]
      );
    }

    for (const genre of book.genres) {
      await client.query(
        `INSERT INTO book_genres (book_id, genre_id)
          VALUES (
            $1, 
            (SELECT genre_id FROM genres WHERE genre_name = $2)
          )`,
        [bookId, genre]
      );
    }
  }
}
