export const ENDPOINTS = {
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,
  USER_POSTS: (id: string) => `/users/${id}/posts`,
  LOGIN: "/auth/login",
  AUTH_ME: "/auth/me",
  REFRESH: "/auth/refresh",
};
