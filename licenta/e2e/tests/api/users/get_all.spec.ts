import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";

test.describe("GET /users 200 OK", () => {
  test("Valideaza status-ul cererii si raspunsul", async ({ request }) => {
    // Trimiterea cererii GET pentru a obține toți utilizatorii
    const response = await request.get(ENDPOINTS.USERS);

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Verificarea dateleor primite
    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(30);
    expect(data).toMatchObject({
      total: 208,
      skip: 0,
      limit: 30,
    });
  });

  test("Verifica limitarea si ignorarea numărului de utilizatori", async ({
    request,
  }) => {
    const limit = 5;
    const skip = 10;

    // Trimiterea cererii GET pentru a obține utilizatorii
    const response = await request.get(ENDPOINTS.USERS, {
      params: {
        limit,
        skip,
      },
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(5);
    expect(data).toMatchObject({
      total: 208,
      skip,
      limit,
    });
  });

  test("Verifica filtrarea utilizatorilor dupa cheie/valoare valida", async ({
    request,
  }) => {
    const key = "firstName";
    const value = "Emily";

    // Trimiterea cererii GET pentru a obține utilizatorii
    const response = await request.get(`${ENDPOINTS.USERS}/filter`, {
      params: {
        key,
        value,
      },
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(2);
    expect(data.users[0].firstName).toBe(value);
    expect(data.users[1].firstName).toBe(value);
    expect(data).toMatchObject({
      total: 2,
      skip: 0,
      limit: 2,
    });
  });

  test("Verifica returnarea unui table gol daca utilizatorii sunt filtrati dupa cheie/valoare invalida", async ({
    request,
  }) => {
    // Trimiterea cererii GET pentru a obține utilizatorii
    const response = await request.get(`${ENDPOINTS.USERS}/filter`, {
      params: {
        key: "invalidKey",
        value: "invalidValue",
      },
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(0);
  });
});
