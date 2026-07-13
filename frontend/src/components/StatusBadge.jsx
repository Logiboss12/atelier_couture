export default function StatusBadge({ status = 'neutral', children }) {
  return <span className={`status ${status}`}>{children}</span>
}
