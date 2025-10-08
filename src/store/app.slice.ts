import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isInitialized: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  isOnline: boolean;
  lastActiveTime: number | null;
}

const initialState: AppState = {
  isInitialized: false,
  theme: 'system',
  language: 'en',
  isOnline: true,
  lastActiveTime: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLastActiveTime: (state, action: PayloadAction<number>) => {
      state.lastActiveTime = action.payload;
    },
    resetApp: (state) => {
      state.isInitialized = false;
      state.theme = 'system';
      state.language = 'en';
      state.isOnline = true;
      state.lastActiveTime = null;
    },
  },
});

export const {
  setInitialized,
  setTheme,
  setLanguage,
  setOnlineStatus,
  setLastActiveTime,
  resetApp,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
