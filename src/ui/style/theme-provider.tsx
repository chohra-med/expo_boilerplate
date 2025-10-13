import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useAppSelector } from "#root/store/store";
import { darkTheme, lightTheme, type Theme } from "./theme";

interface ThemeContextType {
  theme: Theme;
  colorScheme: "light" | "dark" | "system";
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const appTheme = useAppSelector((state) => state.app.theme);
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | "system">("system");

  // Determine the actual theme to use
  const getActualTheme = () => {
    if (colorScheme === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return colorScheme === "dark" ? darkTheme : lightTheme;
  };

  const theme = getActualTheme() as Theme;

  const toggleTheme = () => {
    setColorScheme((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "system";
      return "light";
    });
  };

  // Sync with app state
  useEffect(() => {
    setColorScheme(appTheme);
  }, [appTheme]);

  const contextValue: ThemeContextType = {
    theme,
    colorScheme,
    setColorScheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <RestyleThemeProvider theme={theme}>{children}</RestyleThemeProvider>
    </ThemeContext.Provider>
  );
};
