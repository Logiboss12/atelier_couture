export default function GlassPanel({ className = '', children, ...rest }) {
  return (
    <div className={`glass p-4 ${className}`} {...rest}>
      {children}
    </div>
  )
}
