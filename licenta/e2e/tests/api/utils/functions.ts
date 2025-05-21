import { request } from "@playwright/test";
import { ENDPOINTS } from "../utils/endpoints";

// This function generates a new request context for API testing
async function generateContext() {
  return await request.newContext();
}

/**
 * Fetches all users from the API.
 * @returns a list of users
 */
export async function getUsers() {
  const reqContext = await generateContext();
  const response = await reqContext.get(ENDPOINTS.USERS);
  const data = await response.json();

  return data.users;
}


