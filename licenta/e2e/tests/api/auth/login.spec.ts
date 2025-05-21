import { test, expect, APIResponse } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";
import { getUsers } from "../utils/functions";

test.describe("POST /auth/login 200 OK", () => {
  test("Verifica logarea cu success si obtinerea token-urilor", async ({
    request,
  }) => {
    const users = await getUsers();

    const response = await request.post(ENDPOINTS.LOGIN, {
      data: {
        username: users[0].username,
        password: users[0].password,
      },
    });

    // Verificarea status-ului răspunsului
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    const data = await response.json();

    // Verificarea datelor primite
    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("refreshToken");
    expect(data).toMatchObject({
      id: users[0].id,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      email: users[0].email,
    });
  });
});

test.describe("POST /auth/login 400 Bad Request", () => {
  test("Verifica logarea cu username invalid", async ({ request }) => {
    const users = await getUsers();

    const response = await request.post(ENDPOINTS.LOGIN, {
      data: {
        username: "invalidUser",
        password: users[0].password,
      },
    });

    // Verificarea status-ului răspunsului
    await validateBadLoginResponse(response);
  });

  test("Verifica logarea cu parola invalida", async ({ request }) => {
    const users = await getUsers();

    const response = await request.post(ENDPOINTS.LOGIN, {
      data: {
        username: users[0].username,
        password: "invalidPassword",
      },
    });

    // Verificarea status-ului răspunsului
    await validateBadLoginResponse(response);
  });
});

/**
 * Functie pentru a valida răspunsul de eroare în cazul unui login nereușit
 * @param response - Răspunsul API
 */
async function validateBadLoginResponse(response: APIResponse) {
  // Verificarea status-ului răspunsului
  expect(response.status()).toBe(400);
  expect(response.statusText()).toBe("Bad Request");

  const data = await response.json();

  // Verificarea mesajului de eroare
  expect(data).toHaveProperty("message");
  expect(data.message).toBe("Invalid credentials");
}
