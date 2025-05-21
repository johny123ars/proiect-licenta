import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";

test.describe("GET /users/:id/posts 200 OK", () => {
  test("Valideaza status-ul cererii si detaliile post-urilor unui utilizator", async ({
    request,
  }) => {
    // Trimiterea cererii GET pentru a obține post-urile utilizatorului cu ID-ul 1
    const response = await request.get(ENDPOINTS.USER_POSTS("1"));

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toHaveProperty("posts");
    expect(data.posts).toHaveLength(1);
    expect(data).toMatchObject({
      total: 1,
      skip: 0,
      limit: 1,
    });
    expect(data.posts[0]).toStrictEqual({
      id: 15,
      title: "The trees, therefore, must be such old",
      body: "The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them so inconsequential that even savages like us would know of them and not be suspicious. At that, they probably didn't have too much time after they detected us orbiting and intending to land. And if that were true, there could be only one place where their civilization was hidden.",
      tags: expect.any(Array),
      reactions: expect.any(Object),
      views: 2911,
      userId: 1,
    });
  });
});

test.describe("GET /users/:id/posts 404 Not Found", () => {
  test("Valideaza status-ul cererii si detaliile post-urilor unui utilizator inexistent", async ({
    request,
  }) => {
    // Trimiterea cererii GET pentru a obține post-urile utilizatorului cu ID-ul 1000
    const response = await request.get(ENDPOINTS.USER_POSTS("1000"));

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe("Not Found");
  });
});

test.describe("GET /users/:id/posts 400 Bad Request", () => {
  test("Valideaza status-ul cererii si detaliile post-urilor unui utilizator cu id invalid", async ({
    request,
  }) => {
    // Trimiterea cererii GET pentru a obține post-urile utilizatorului cu ID-ul 1000
    const response = await request.get(ENDPOINTS.USER_POSTS("abc"));

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(400);
    expect(response.statusText()).toBe("Bad Request");
  });
});
