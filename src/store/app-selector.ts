import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

const selectApp = (state: RootState) => state.app;

export const selectIsOnboardingCompleted = createSelector(selectApp, (app) => app.isInitialized);

export const selectIsAppInitialized = createSelector(selectApp, (app) => app.isInitialized);

export const selectLanguage = createSelector(selectApp, (app) => app.language);

export const selectThemeMode = createSelector(selectApp, (app) => app.theme);
