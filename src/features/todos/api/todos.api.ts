import { api } from "#root/services/api/api";
import { type TodosResponse, TodosResponseSchema } from "../types";

const todosApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTodos: builder.query<TodosResponse, void>({
      query: () => ({
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        // Validate response with Zod schema
        return TodosResponseSchema.parse(response);
      },
      providesTags: ["Todos"],
    }),
  }),
});

export const { useGetTodosQuery } = todosApi;
