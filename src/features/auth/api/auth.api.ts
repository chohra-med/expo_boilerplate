import { api } from '#root/services/api/api';
import { type AuthResponse, AuthResponseSchema, type LoginCredentials } from '../types';

const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: unknown) => {
        // Validate response with Zod schema
        return AuthResponseSchema.parse(response);
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation } = authApi;
