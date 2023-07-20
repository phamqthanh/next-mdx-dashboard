import clsx from 'clsx';

export function Prose<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: { as: T } & JSX.IntrinsicElements['div']) {
  const Component: any = as || 'div';
  return (
    <Component
      className={clsx(className, 'prose dark:prose-invert')}
      {...props}
    />
  );
}
