import { z } from 'zod';

export const TodoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export const TodosResponseSchema = z.array(TodoSchema);

export type Todo = z.infer<typeof TodoSchema>;
export type TodosResponse = z.infer<typeof TodosResponseSchema>;

export interface TodoState {
  todos: Todo[];
  completedTodos: Todo[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  isCompleted: boolean;
}
