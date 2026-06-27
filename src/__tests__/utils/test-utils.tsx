/**
 * Test Utilities
 *
 * @description Common utilities for testing React Native components.
 * Includes custom render function with Redux provider and other helpers.
 *
 * @example
 * ```typescript
 * import { renderWithProviders, screen } from '#root/__tests__/utils/test-utils';
 *
 * test('renders component', () => {
 *   renderWithProviders(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeTruthy();
 * });
 * ```
 */

import { configureStore, type Reducer } from "@reduxjs/toolkit";
import { type RenderOptions, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
// Import your actual reducers
// NOTE: Update these imports based on your actual store structure
import { type RootState, rootReducer } from "#root/store/reducers";

/**
 * Extended render options with Redux preloaded state
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

/**
 * Create a test store with optional preloaded state
 */
export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer as Reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for testing
      }),
  });
}

/**
 * Custom render function that includes Redux Provider
 *
 * @example
 * ```typescript
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   preloadedState: {
 *     auth: { user: mockUser, isAuthenticated: true }
 *   }
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Wait for a condition to be true
 *
 * @example
 * ```typescript
 * await waitForCondition(() => mockApi.called === true);
 * ```
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Timeout waiting for condition after ${timeout}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Mock async function that resolves after a delay
 */
export const mockAsyncDelay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Create a mock promise that can be resolved/rejected externally
 */
export function createDeferredPromise<T>() {
  let resolveFunc: ((value: T | PromiseLike<T>) => void) | undefined;
  let rejectFunc: ((reason?: unknown) => void) | undefined;

  const promise = new Promise<T>((res, rej) => {
    resolveFunc = res;
    rejectFunc = rej;
  });

  if (!resolveFunc || !rejectFunc) {
    throw new Error("Promise executor did not set resolve/reject functions");
  }

  return {
    promise,
    resolve: resolveFunc as (value: T | PromiseLike<T>) => void,
    reject: rejectFunc as (reason?: unknown) => void,
  };
}

/**
 * Re-export everything from React Native Testing Library
 */
export * from "@testing-library/react-native";

/**
 * Re-export renderWithProviders as default render for convenience
 */
export { renderWithProviders as render };
