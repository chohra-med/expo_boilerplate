import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '#root/features/auth';
import { setLanguage, setTheme } from '#root/store/app.slice';
import { selectLanguage, selectThemeMode } from '#root/store/app-selector';
import { useAppDispatch, useAppSelector } from '#root/store/store';

export const useSettings = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);
  const themeMode = useAppSelector(selectThemeMode);
  const { logout } = useAuth();

  const handleSetLanguage = useCallback(
    (newLanguage: 'en' | 'fr') => {
      dispatch(setLanguage(newLanguage));
      i18n.changeLanguage(newLanguage);
    },
    [dispatch, i18n]
  );

  const handleSetThemeMode = useCallback(
    (newThemeMode: 'light' | 'dark' | 'system') => {
      dispatch(setTheme(newThemeMode));
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    language,
    themeMode,
    setLanguage: handleSetLanguage,
    setThemeMode: handleSetThemeMode,
    handleLogout,
  };
};
