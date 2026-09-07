import { ComponentPropsWithoutRef, createElement, JSX, ReactElement, ReactNode } from "react";

type TruncateOptions = {
  enabled?: boolean;
  length: number;
};

type TypographProps<T extends keyof JSX.IntrinsicElements> = {
  tag: T;
  truncate?: TruncateOptions;
} & ComponentPropsWithoutRef<T>;

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const Typograph = <T extends keyof JSX.IntrinsicElements>(
  props: TypographProps<T>,
): ReactElement => {
  const { tag, truncate, ...restProps } = props;

  // Extract children and dangerouslySetInnerHTML safely
  const { children, dangerouslySetInnerHTML, ...propsWithoutTag } =
    restProps as ComponentPropsWithoutRef<T> & {
      children?: ReactNode;
      dangerouslySetInnerHTML?: { __html: string };
    };

  let content = children;
  if (truncate?.enabled && typeof children === "string") {
    content = truncateText(children, truncate.length);
  }

  const elementProps = propsWithoutTag as Record<string, unknown>;

  if (dangerouslySetInnerHTML) {
    return createElement(tag, {
      ...elementProps,
      dangerouslySetInnerHTML,
    });
  }

  return createElement(tag, elementProps, content);
};
