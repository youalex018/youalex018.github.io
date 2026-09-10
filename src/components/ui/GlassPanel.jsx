export function GlassPanel({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`glass rounded-2xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}
