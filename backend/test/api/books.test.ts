import request from "supertest";
import { describe, it, expect } from "vitest";
import "../extendExpect.js";
import { app } from "#src/app.js";
import "../setup.js";
import type {
  BookData,
  BookPropEntity,
} from "#src/feature/books/books.types.js";
import { login } from "../helpers.js";

describe("Books API", () => {
  describe("GET /books", () => {
    it("return status 200 and Array body without query param", async () => {
      const res = await request(app).get("/books/");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    describe("GET /books with query param", () => {
      it("query title return matching result", async () => {
        const res = await request(app).get("/books?title=an");

        expect(res.status).toBe(200);
        expect(res.body).toContainLike((book: BookData) =>
          book.title.includes("an")
        );
      });

      it("query genre return matching result", async () => {
        function genresContain(ids: number[]) {
          return (book: BookData) =>
            book.genres.some((genre) => ids.includes(genre.id));
        }

        const res1 = await request(app).get("/books?genre=2");
        const res2 = await request(app).get("/books?genre=1&genre=2");

        expect(res1.status).toBe(200);
        expect(res1.body).toContainLike(genresContain([2]));
        expect(res2.status).toBe(200);
        expect(res2.body).toContainLike(genresContain([1, 2]));
      });

      it("query author return matching result", async () => {
        function authorsContain(ids: number[]) {
          return (book: BookData) =>
            book.authors.some((author) => ids.includes(author.id));
        }

        const res1 = await request(app).get("/books?author=1");
        const res2 = await request(app).get("/books?author=3&author=5");

        expect(res1.status).toBe(200);
        expect(res1.body).toContainLike(authorsContain([1]));
        expect(res2.status).toBe(200);
        expect(res2.body).toContainLike(authorsContain([3, 5]));
      });

      it("query title&genre&author return matching result", async () => {
        const res = await request(app).get(
          "/books?author=1&title=Math&genre=1&genre=2"
        );

        expect(res.status).toBe(200);
        expect(res.body).toContainLike((book: BookData) => {
          return (
            book.title.includes("Math") &&
            book.genres.some((genre: BookPropEntity) =>
              [1, 2].includes(genre.id)
            ) &&
            book.authors.some((author: BookPropEntity) => author.id === 1)
          );
        });
      });

      it("return status 400 on bad query value", async () => {
        const res1 = await request(app).get("/books?genre=notInt");
        const res2 = await request(app).get("/books?author=2x");
        const res3 = await request(app).get("/books?genre=2&author=1.414");

        expect(res1.status).toBe(400);
        expect(res2.status).toBe(400);
        expect(res3.status).toBe(400);
      });
    });
  });

  describe("GET /books/:id", () => {
    it("return status 200 and correct ID book", async () => {
      const res = await request(app).get("/books/1");
      expect(res.status).toBe(200);
      expect(res.body?.id).toBe(1);
    });

    it("return status 400 on non integer ID", async () => {
      const res = await request(app).get("/books/notint");
    });
  });

  describe("POST /books", () => {
    it("return status 401 without auth", async () => {
      const res = await request(app)
        .post("/books")
        //.attach("coverImage", "../files/coversample.png")
        .field(
          "details",
          JSON.stringify({ title: "test title", genres: [1], authors: [1, 2] })
        );

      expect(res.status).toBe(401);
    });

    it("create book and return status 201 with ID", async () => {
      const authCookies = await login("admin");
      if (authCookies == null) {
        expect(authCookies != null).toBe(true);
        return;
      }

      const createRes = await request(app)
        .post("/books")
        .set("Cookie", authCookies)
        // .attach("coverImage", "../files/coversample.png", "coversample.png")
        .field(
          "details",
          JSON.stringify({ title: "test title", genres: [1], authors: [1, 2] })
        );

      const bookId = createRes.body?.bookId;
      expect(createRes.status).toBe(201);
      expect(Number.isInteger(bookId)).toBe(true);

      const bookRes = await request(app).get(`/books/${bookId}`);
      expect(bookRes.status).toBe(200);
    });
  });

  describe("PUT /books/:id", () => {
    it("update book details and return status 204", async () => {
      const testBookDetails = [
        { title: "test UPDATE #1", authors: [1], genres: [1, 2] },
        { title: "test UPDATE #2", authors: [2, 3], genres: [1] },
      ];
      const authCookies = await login("admin");
      if (authCookies == null) {
        expect(authCookies != null).toBe(true);
        return;
      }

      const bookDetails = (await request(app).get("/books/2")).body;
      let useDetailsIndex = 0;
      if ((bookDetails.title = testBookDetails[0].title)) useDetailsIndex = 1;
      const usingDetails = testBookDetails[useDetailsIndex];

      const updateRes = await request(app)
        .put("/books/3")
        .send(usingDetails)
        .set("Cookie", authCookies);

      expect(updateRes.status).toBe(204);
      const newBookDetailsRes = await request(app).get("/books/3");
      expect(newBookDetailsRes.body.title).toBe(usingDetails.title);
      expect(
        newBookDetailsRes.body.genres.map((genre: BookPropEntity) => genre.id)
      ).toEqual(usingDetails.genres);
      expect(
        newBookDetailsRes.body.authors.map(
          (author: BookPropEntity) => author.id
        )
      ).toEqual(usingDetails.authors);
    });
  });
  describe("DELETE /books/:id", () => {
    it("delete book and return status 204", async () => {
      const authCookies = await login("admin");
      if (authCookies == null) {
        expect(authCookies != null).toBe(true);
        return;
      }

      const booksRes = await request(app).get("/books");
      const lastBookId = booksRes.body.at(-1).id;

      const deleteRes = await request(app)
        .delete(`/books/${lastBookId}`)
        .set("Cookie", authCookies);
      expect(deleteRes.status).toBe(204);

      const deletedBookRes = await request(app).get(`/books/${lastBookId}`);
      expect(deletedBookRes.status).toBe(404);
    });
  });

  //describe("GET /books/:id/cover", () => {});
  //describe("PUT /books/:id/cover", () => {});

  describe("GET /books/genre", () => {
    it("return 200 with Array body", async () => {
      const res = await request(app).get("/books/genres");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("query search return 200 with matching result", async () => {
      const res = await request(app).get("/books/genres?search=e");

      expect(res.body).toContainLike((genre: BookPropEntity) =>
        genre.name.includes("e")
      );
    });
  });

  describe("GET /books/authors", () => {
    it("return 200 with Array body", async () => {
      const res = await request(app).get("/books/authors");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("query search return 200 with matching result", async () => {
      const res = await request(app).get("/books/authors?search=i");

      expect(res.body).toContainLike((author: BookPropEntity) =>
        author.name.includes("i")
      );
    });
  });

  describe("POST /books/genre", () => {
    it("", async () => {
      const authCookies = await login("admin");
      if (authCookies == null) {
        expect(authCookies != null).toBe(true);
        return;
      }

      //TODO: delete test genre - genre must be unique
      const createRes = await request(app)
        .post("/books/genres")
        .set("Cookie", authCookies)
        .send({ genre: "testGenre" });
      expect(createRes.status).toBe(200);

      const genreSearchRes = await request(app).get(
        `/books/genres?search=${createRes.body.id}`
      );
      expect(genreSearchRes.body).toContainLike((book: BookData) => {
        book.genres.some((genre) => genre.name.includes("testGenre"));
      });
      expect(genreSearchRes.body).toContainLike(
        (genre: BookPropEntity) =>
          genre.id === createRes.body.id && genre.name === "testGenre"
      );
    });
  });
  describe("POST /books/authors", () => {
    it("", async () => {
      const authCookies = await login("admin");
      if (authCookies == null) {
        expect(authCookies != null).toBe(true);
        return;
      }

      //TODO: delete test author - author must be unique
      const createRes = await request(app)
        .post("/books/authors")
        .set("Cookie", authCookies)
        .send({ author: "testAuthor" });
      expect(createRes.status).toBe(200);
      const authorSearchRes = await request(app).get(
        `/books/authors?search=${createRes.body.id}`
      );
      expect(authorSearchRes.body).toContainLike(
        (author: BookPropEntity) =>
          author.id === createRes.body.id && author.name === "testAuthor"
      );
    });
  });
});
