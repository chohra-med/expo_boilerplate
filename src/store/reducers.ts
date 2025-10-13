import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "#root/features/auth/store/auth-slice";
import { onboardingReducer } from "#root/features/onboarding/store/onboarding-slice";
import { todosReducer } from "#root/features/todos/store/todos-slice";
import { api } from "#root/services/api/api";
import { appReducer } from "./app.slice";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  app: appReducer,
  auth: authReducer,
  onboarding: onboardingReducer,
  todos: todosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
