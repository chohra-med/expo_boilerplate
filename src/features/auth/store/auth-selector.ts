import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '#root/store/store';

const selectAuth = (state: RootState) => state.auth;

export const selectUser = createSelector(selectAuth, (auth) => auth.user);

export const selectIsAuthenticated = createSelector(selectAuth, (auth) => auth.isAuthenticated);

export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.isLoading);

export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);

export const selectAuthTokens = createSelector(selectAuth, (auth) => auth.tokens);

export const selectAuthState = createSelector(selectAuth, (auth) => auth);
