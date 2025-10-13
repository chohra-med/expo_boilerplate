import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "#root/store/store";

const selectTodos = (state: RootState) => state.todos;

export const selectTodosState = createSelector(selectTodos, (todos) => todos);

export const selectActiveTodos = createSelector(selectTodos, (todos) => todos.todos);

export const selectCompletedTodos = createSelector(selectTodos, (todos) => todos.completedTodos);

export const selectTodosLoading = createSelector(selectTodos, (todos) => todos.isLoading);

export const selectTodosError = createSelector(selectTodos, (todos) => todos.error);

export const selectTodosCount = createSelector(selectTodos, (todos) => ({
  active: todos.todos.length,
  completed: todos.completedTodos.length,
  total: todos.todos.length + todos.completedTodos.length,
}));

export const selectIsInitialized = createSelector(selectTodos, (todos) => todos.isInitialized);
