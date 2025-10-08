import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useTheme } from '../style/theme-provider';

export interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: React.ComponentProps<typeof Ionicons>['style'];
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'text', style }) => {
  const { theme } = useTheme();
  const iconColor = theme.colors[color as keyof typeof theme.colors] as string;
  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};
