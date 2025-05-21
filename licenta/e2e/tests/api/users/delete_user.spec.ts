import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";

test.describe("DELETE /users/:id 200 OK", () => {
  test("Valideaza status-ul cererii si raspunsul", async ({ request }) => {
    // Trimiterea cererii DELETE pentru a sterge utilizatorul cu ID-ul 1
    const response = await request.delete(ENDPOINTS.USER("1"));

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");
  });
});

test.describe("DELETE /users/:id 404 Not Found", () => {
  test("Verifica stergerea unui utilizator care nu exista", async ({ request }) => {
    // Trimiterea cererii DELETE pentru a sterge utilizatorul cu ID-ul 999
    const response = await request.delete(ENDPOINTS.USER("999"));

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(404);
    expect(response.statusText()).toBe("Not Found");
  });
});
