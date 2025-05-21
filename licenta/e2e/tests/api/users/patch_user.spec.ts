import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";
import { faker } from "@faker-js/faker";

const userId = "1"; // ID-ul utilizatorului pe care dorim să-l actualizăm
const newUserData = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
};

test.beforeEach(async ({ request }) => {
  // Validarea datelor utilizatorului existent
  const getUserResponse = await request.get(ENDPOINTS.USER(userId));
  expect(getUserResponse.status()).toBe(200);
  const userData = await getUserResponse.json();
  expect(userData).toMatchObject({
    id: 1,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@x.dummyjson.com",
  });
});

test.describe("PATCH|PUT /users 200 OK", () => {
  test("Verifica editarea unui utilizator prin metoda PATCH", async ({
    request,
  }) => {
    // Trimiterea cererii PATCH pentru a crea un utilizator nou
    const response = await request.patch(ENDPOINTS.USER(userId), {
      data: newUserData,
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toMatchObject(newUserData);
    expect(data).toHaveProperty("id", 1);
  });

  test("Verifica editarea unui utilizator prin metoda PUT", async ({
    request,
  }) => {
    // Trimiterea cererii PUT pentru a crea un utilizator nou
    const response = await request.put(ENDPOINTS.USER(userId), {
      data: newUserData,
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toMatchObject(newUserData);
    expect(data).toHaveProperty("id", 1);
  });
});

test.describe("PATCH|PUT /users 400 Bad Request", () => {
  test("Verifica editarea unui utilizator cu id invalid", async ({
    request,
  }) => {
    // Trimiterea cererii PATCH pentru a crea un utilizator nou
    const response = await request.patch(ENDPOINTS.USER("abc"), {
      data: newUserData,
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(400);
    expect(response.statusText()).toBe("Bad Request");

    const data = await response.json();

    // Verificarea mesajului de eroare
    expect(data).toHaveProperty("message");
  });
});

test.describe("PATCH|PUT /users 404 Not Found", () => {
  test("Verifica editarea unui utilizator care nu exista", async ({
    request,
  }) => {
    // Trimiterea cererii PATCH pentru a crea un utilizator nou
    const response = await request.patch(ENDPOINTS.USER("999"), {
      data: newUserData,
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe("Not Found");

    const data = await response.json();

    // Verificarea mesajului de eroare
    expect(data).toHaveProperty("message");
  });
});
