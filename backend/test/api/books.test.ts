import request from "supertest";
import { describe, it, expect } from "vitest";
import "../extendExpect.js";
import { app } from "#src/index.js";
import type {
  BookData,
  BookPropEntity,
} from "#src/feature/books/books.types.js";

describe("Books API", () => {
  describe("GET /books", () => {
    it("GET /books return status 200 and Array body", async () => {
      const res = await request(app).get("/books/");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    describe("GET /books with query param", () => {
      it("query title return matching result", async () => {
        const res = await request(app).get("/books?title=an");
        expect(res.body).toContainLike((book: { title: string }) =>
          book.title.includes("a")
        );
      });

      it("query genre return matching result", async () => {
        function genresContain(ids: number[]) {
          return (book: BookData) =>
            book.genres.some((genre) => ids.includes(genre.id));
        }

        const res1 = await request(app).get("/books?genre=2");
        const res2 = await request(app).get("/books?genre=1&genre=2");

        expect(res1.body).toContainLike(genresContain([2]));
        expect(res2.body).toContainLike(genresContain([1, 2]));
      });

      it("query author return matching result", async () => {
        function authorsContain(ids: number[]) {
          return (book: BookData) =>
            book.authors.some((author) => ids.includes(author.id));
        }

        const res1 = await request(app).get("/books?author=1");
        const res2 = await request(app).get("/books?author=3&author=5");

        expect(res1.body).toContainLike(authorsContain([1]));
        expect(res2.body).toContainLike(authorsContain([3, 5]));
      });

      it("query title&genre&author return matching result", async () => {
        const res1 = await request(app).get(
          "/books?author=1&title=Math&genre=1&genre=2"
        );
        expect(res1.body).toContainLike((book: BookData) => {
          return (
            book.title.includes("Math") &&
            book.genres.some((genre: BookPropEntity) =>
              [1, 2].includes(genre.id)
            ) &&
            book.authors.some((author: BookPropEntity) => author.id === 1)
          );
        });
      });

      it("query return status 400 on bad query value", async () => {
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
    it("", async () => {
      const res = await request(app).get("/book/1");
      expect(res.status).toBe(200);
      expect(res.body?.id).toBe(1);
    });
  });
  describe("POST /books", () => {});
  describe("POST /books");
  describe("PUT /books/:id");
  describe("DELETE /books/:id");

  describe("GET /books/:id/cover");
  describe("PUT /books/:id/cover");

  describe("GET /books/genre");
  describe("GET /books/authors");
  describe("POST /books/genre");
  describe("POST /books/authors");
});
