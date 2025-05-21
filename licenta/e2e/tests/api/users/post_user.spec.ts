import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";
import { faker } from "@faker-js/faker";

const requestUrl = `${ENDPOINTS.USERS}/add`;

test.describe("POST /users 200 OK", () => {
  test("Verifica crearea unui utilizator nou", async ({ request }) => {
    const newUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    // Trimiterea cererii POST pentru a crea un utilizator nou
    const response = await request.post(requestUrl, {
      data: newUser,
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(201);
    expect(response.statusText()).toBe("Created");

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toMatchObject(newUser);
    expect(data).toHaveProperty("id");
  });
});
