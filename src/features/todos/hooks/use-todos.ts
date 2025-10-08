import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '#root/store/store';
import { useGetTodosQuery } from '../api/todos.api';
import {
  selectActiveTodos,
  selectCompletedTodos,
  selectTodosCount,
  selectTodosError,
  selectTodosLoading,
} from '../store/todos-selector';
import { clearCompletedTodos, resetTodos, toggleTodoComplete } from '../store/todos-slice';

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const { data: todosData, isLoading, error, refetch } = useGetTodosQuery();

  const activeTodos = useAppSelector(selectActiveTodos);
  const completedTodos = useAppSelector(selectCompletedTodos);
  const todosLoading = useAppSelector(selectTodosLoading);
  const todosError = useAppSelector(selectTodosError);
  const todosCount = useAppSelector(selectTodosCount);

  const handleToggleComplete = useCallback(
    (id: number) => {
      dispatch(toggleTodoComplete(id));
    },
    [dispatch]
  );

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompletedTodos());
  }, [dispatch]);

  const handleResetTodos = useCallback(() => {
    dispatch(resetTodos());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Data
    todosData,
    activeTodos,
    completedTodos,
    todosCount,

    // Loading states
    isLoading,
    todosLoading,

    // Error states
    error,
    todosError,

    // Actions
    toggleComplete: handleToggleComplete,
    clearCompleted: handleClearCompleted,
    resetTodos: handleResetTodos,
    refresh: handleRefresh,
  };
};
