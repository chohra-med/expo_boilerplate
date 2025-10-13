import type React from "react";
import Toast from "react-native-toast-message";

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toast />
    </>
  );
};
