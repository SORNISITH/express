const { test, describe } = require("node:test");
const assert = require("node:assert");
const dummy = require("./list_blog.js").dummy;
const totallike = require("./list_blog.js").totallike;
const list = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
  },
  {
    author: "Robert C. Martin",
    blogs: 3,
    likes: 2,
  },
];

describe("my simple test => ", () => {
  test("test dummy ", () => {
    assert.strictEqual(dummy([]), 1);
  });
  describe("total like", () => {
    test("of empty array return 0", () => {
      assert.strictEqual(totallike([]), 0);
    });
    test("list has only blog show number of like", () => {
      assert.strictEqual(
        totallike([
          {
            author: "Edsger W. Dijkstra",
            likes: 17,
          },
        ]),
        17,
      );
    });
    test("of show only blog have alot of like", () => {
      assert.strictEqual(totallike(list), 12);
    });
  });
});
