import type { ReactElement } from "react";
import ErrorBoundary from "react-native-error-boundary";

import { ErrorFallback } from "./components/error-fallback";

type AppErrorBoundaryProps = {
  children: ReactElement;
};

export const AppErrorBoundary = ({ children }: AppErrorBoundaryProps) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};
