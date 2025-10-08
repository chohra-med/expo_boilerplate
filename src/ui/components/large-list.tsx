import { FlashList, type FlashListProps, type FlashListRef } from '@shopify/flash-list';
import type React from 'react';
import { forwardRef } from 'react';
import { Box } from './box';

export interface LargeListProps<T> extends FlashListProps<T> {}

export const LargeList = forwardRef<FlashListRef<unknown>, LargeListProps<unknown>>(
  ({ renderItem, data, ...props }, ref) => {
    return (
      <Box flex={1}>
        <FlashList ref={ref} data={data} renderItem={renderItem} {...props} />
      </Box>
    );
  }
) as <T>(props: LargeListProps<T> & { ref?: React.Ref<FlashListRef<T>> }) => React.ReactElement;
