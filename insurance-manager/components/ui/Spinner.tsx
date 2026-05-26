export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: 'var(--border)',
        borderTopColor: 'var(--primary)',
      }}
    />
  )
}
