interface Props {
  className: string;
  children: React.ReactNode;
}
export function StatusBadge({ className, children }: Props) {
  return <span className={className}>{children}</span>;
}
