import { createText } from "@shopify/restyle";
import type { ComponentProps } from "react";
import type { Theme } from "#root/ui/style/theme";
import type { TextTypeVariantProps } from "#root/ui/style/variants/text-variants";

const BaseText = createText<Theme>();

export type TextComponentProps = ComponentProps<typeof BaseText> & TextTypeVariantProps;

export const Text = ({ variant, children, ...props }: TextComponentProps) => {
  return (
    <BaseText variant={variant} {...props}>
      {children}
    </BaseText>
  );
};
