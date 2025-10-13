import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "#root/store/store";

// This would be your actual API base URL
const API_BASE_URL = "https://api.example.com";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const state = getState() as RootState;
      const token = state.auth?.tokens?.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Auth", "Onboarding", "Todos"],
  endpoints: () => ({}),
});
