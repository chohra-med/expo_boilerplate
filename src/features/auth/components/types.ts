export interface LoginFormProps {
  onSuccess: (data: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onError: (error: string) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}
