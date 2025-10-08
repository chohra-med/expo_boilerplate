import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Text } from '#root/ui/components/index';

type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};
export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (error) {
      // LOG ERROR here
      console.error(error);
    }
  }, [error]);

  //TODO: Updated UI

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="background">
      <Text variant="h1">{t('errors.app_error_boundary.title')}</Text>
      <Text variant="body">{t('errors.app_error_boundary.message')}</Text>
      <Button
        buttonTypeVariant="primary"
        onPress={resetError}
        title={t('errors.app_error_boundary.retry')}
      />
    </Box>
  );
};
