import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo, TodoState } from '../types';

const initialState: TodoState = {
  todos: [],
  completedTodos: [],
  isLoading: false,
  error: null,
  isInitialized: false,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
      state.error = null;
      state.isInitialized = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleTodoComplete: (state, action: PayloadAction<number>) => {
      const todoId = action.payload;
      const todoIndex = state.todos.findIndex((todo) => todo.id === todoId);

      if (todoIndex !== -1) {
        const todo = state.todos[todoIndex];
        const updatedTodo = { ...todo, completed: !todo.completed };

        if (updatedTodo.completed) {
          // Move to completed todos (add to top)
          state.completedTodos.unshift(updatedTodo);
          state.todos.splice(todoIndex, 1);
        } else {
          // Move back to active todos
          const completedIndex = state.completedTodos.findIndex((t) => t.id === todoId);
          if (completedIndex !== -1) {
            state.completedTodos.splice(completedIndex, 1);
            state.todos.push(updatedTodo);
          }
        }
      }
    },
    setCompletedTodos: (state, action: PayloadAction<Todo[]>) => {
      state.completedTodos = action.payload;
    },
    clearCompletedTodos: (state) => {
      state.completedTodos = [];
    },
    resetTodos: (state) => {
      state.todos = [];
      state.completedTodos = [];
      state.error = null;
      state.isInitialized = false;
    },
  },
});

export const {
  setTodos,
  setLoading,
  setError,
  toggleTodoComplete,
  setCompletedTodos,
  clearCompletedTodos,
  resetTodos,
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
