import type { FlashListRef } from '@shopify/flash-list';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, UIManager } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '#root/store/store';
import { Box, Card, Icon, LargeList, SafeArea, Text } from '#root/ui/components';
import { useGetTodosQuery } from '../api/todos.api';
import { TodoItem } from '../components/todo-item';
import {
  selectActiveTodos,
  selectCompletedTodos,
  selectIsInitialized,
  selectTodosCount,
  selectTodosError,
} from '../store/todos-selector';
import { setCompletedTodos, setError, setTodos, toggleTodoComplete } from '../store/todos-slice';
import type { Todo } from '../types';

// Enable LayoutAnimation for Android
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Todos screen component
 * Displays active and completed todos with statistics
 * Includes smooth animations and scroll functionality
 */
export const TodosScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data: todosData, isLoading, error } = useGetTodosQuery();
  const activeTodos = useAppSelector(selectActiveTodos);
  const completedTodos = useAppSelector(selectCompletedTodos);
  const todosError = useAppSelector(selectTodosError);
  const todosCount = useAppSelector(selectTodosCount);
  const isInitialized = useAppSelector(selectIsInitialized);

  // Refs for scrolling
  const activeListRef = useRef<FlashListRef<Todo> | null>(null);
  const completedListRef = useRef<FlashListRef<Todo> | null>(null);

  useEffect(() => {
    if (todosData && !isInitialized) {
      // Only set initial data if not already initialized
      const active = todosData.filter((todo) => !todo.completed);
      const completed = todosData.filter((todo) => todo.completed);

      dispatch(setTodos(active));
      // Set completed todos in a separate action
      dispatch(setCompletedTodos(completed));
    }
  }, [todosData, dispatch, isInitialized]);

  useEffect(() => {
    if (error) {
      dispatch(setError('Failed to fetch todos'));
    }
  }, [error, dispatch]);

  /**
   * Scrolls to the top of the completed todos list
   */
  const scrollToCompleted = useCallback(() => {
    if (completedListRef.current) {
      completedListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  /**
   * Handles toggling todo completion status
   * @param id - The ID of the todo to toggle
   */
  const handleToggleComplete = useCallback(
    (id: number) => {
      // Configure layout animation for smooth item removal/addition
      LayoutAnimation.configureNext({
        duration: 400,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });

      dispatch(toggleTodoComplete(id));
      // Scroll to completed section after a short delay to allow animation
      setTimeout(() => {
        scrollToCompleted();
      }, 300);
    },
    [dispatch, scrollToCompleted]
  );

  const renderTodoItem = useCallback(
    ({ item }: { item: Todo }) => (
      <Animated.View entering={SlideInLeft}>
        <TodoItem todo={item} onToggleComplete={handleToggleComplete} isCompleted={false} />
      </Animated.View>
    ),
    [handleToggleComplete]
  );

  const renderCompletedTodoItem = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem todo={item} onToggleComplete={handleToggleComplete} isCompleted={true} />
    ),
    [handleToggleComplete]
  );

  const EmptyComponent = useCallback(
    () => (
      <Box alignItems="center" padding="xl">
        <Icon name="checkmark-circle" size={48} color="textSecondary" />
        <Text variant="h4" marginTop="md" color="textSecondary">
          {t('todos.noTodos')}
        </Text>
      </Box>
    ),
    [t]
  );

  const LoadingComponent = useCallback(
    () => (
      <Box alignItems="center" padding="xl">
        <Text variant="body" color="textSecondary">
          {t('todos.loading')}
        </Text>
      </Box>
    ),
    [t]
  );

  if (todosError) {
    return (
      <SafeArea>
        <Box flex={1} padding="lg" alignItems="center" justifyContent="center">
          <Icon name="alert-circle" size={48} color="error" />
          <Text variant="h4" marginTop="md" color="error">
            {todosError}
          </Text>
        </Box>
      </SafeArea>
    );
  }
  if (isLoading) {
    return (
      <SafeArea>
        <LoadingComponent />
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Box flex={1} paddingHorizontal="lg">
        <Box>
          <Text variant="h1" marginBottom="sm">
            {t('todos.title')}
          </Text>
          <Text variant="body" color="textSecondary">
            {t('todos.subtitle')}
          </Text>
        </Box>

        <Box gap="lg" flex={1}>
          {/* Stats Cards */}
          <Box flexDirection="row" gap="md">
            <Card variant="elevated" flex={1} padding="md">
              <Box alignItems="center">
                <Text variant="h3" color="primary">
                  {todosCount.active}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {t('todos.active')}
                </Text>
              </Box>
            </Card>
            <Card variant="elevated" flex={1} padding="md">
              <Box alignItems="center">
                <Text variant="h3" color="success">
                  {todosCount.completed}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {t('todos.completed')}
                </Text>
              </Box>
            </Card>
          </Box>

          {/* Active Todos */}
          <Box flex={1}>
            <Text variant="h4" marginBottom="md">
              {t('todos.activeTodos')} ({todosCount.active})
            </Text>
            <LargeList
              ref={activeListRef}
              data={activeTodos}
              renderItem={renderTodoItem}
              ListEmptyComponent={todosCount.active === 0 ? EmptyComponent : undefined}
            />
          </Box>

          {/* Completed Todos */}
          {todosCount.completed > 0 && (
            <Box flex={1}>
              <Text variant="h4" marginBottom="md">
                {t('todos.completedTodos')} ({todosCount.completed})
              </Text>
              <LargeList
                ref={completedListRef}
                data={completedTodos}
                renderItem={renderCompletedTodoItem}
                ListEmptyComponent={todosCount.completed === 0 ? EmptyComponent : undefined}
              />
            </Box>
          )}
        </Box>
      </Box>
    </SafeArea>
  );
};
