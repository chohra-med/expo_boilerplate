import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Button, Input, Text } from '#root/ui/components';
import { LoginCredentialsSchema, type LoginFormData } from '../types';
import type { LoginFormProps } from './types';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  onForgotPassword,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginCredentialsSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await onSuccess(data);
      if (!result.success) {
        onError(result.error || t('auth.loginError'));
      }
    } catch (_error) {
      onError(t('auth.loginError'));
    }
  };

  const handleForgotPasswordDefault = () => {
    // Default handler - does nothing
  };

  return (
    <Box flex={1} padding="lg">
      <Box marginBottom="xl">
        <Text variant="h1" textAlign="center" marginBottom="sm">
          {t('auth.login')}
        </Text>
        <Text variant="body" textAlign="center" color="textSecondary">
          {t('onboarding.welcome.subtitle')}
        </Text>
      </Box>

      <Box gap="lg">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.email')}
              placeholder={t('auth.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('auth.password')}
              placeholder={t('auth.password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              rightIcon={
                <Button
                  title={showPassword ? 'Hide' : 'Show'}
                  onPress={() => setShowPassword(!showPassword)}
                  buttonTypeVariant="ghost"
                  buttonSizeVariant="small"
                />
              }
            />
          )}
        />

        <Button
          title={t('auth.forgotPassword')}
          onPress={onForgotPassword || handleForgotPasswordDefault}
          buttonTypeVariant="ghost"
          buttonSizeVariant="small"
        />
      </Box>

      <Box marginTop="xl">
        <Button
          title={t('auth.loginButton')}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || isLoading}
        />
      </Box>
    </Box>
  );
};
