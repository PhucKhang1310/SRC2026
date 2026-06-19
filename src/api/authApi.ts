import {
  API_ENDPOINTS,
  readErrorMessage,
} from "./apiClient";

export type CurrentUser = {
  id: string;
  email: string;
  role: string;
};

export const callEmailSignup = async (
  email: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Email signup failed with ${response.status}`,
      ),
    );
  }

  return response.json() as Promise<{ message: string }>;
};

export const login = async (
  email: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Login failed with ${response.status}`,
      ),
    );
  }

  return response.json() as Promise<{ message: string; user: CurrentUser }>;
};

export const getCurrentUser = async (signal?: AbortSignal) => {
  const response = await fetch(API_ENDPOINTS.me, {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }

    throw new Error(
      await readErrorMessage(response, `Could not check login status: ${response.status}`),
    );
  }

  const payload = (await response.json()) as { user: CurrentUser };
  return payload.user;
};

export const logout = async (signal?: AbortSignal) => {
  const response = await fetch(API_ENDPOINTS.logout, {
    method: "POST",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Logout failed with ${response.status}`),
    );
  }

  return response.json() as Promise<{ message: string }>;
};
