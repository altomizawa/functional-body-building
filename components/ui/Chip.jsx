export default function Chip({ status }) {
  const chipStatus = {
    active: 'bg-blue-500',
    inactive: 'bg-gray-400',
    expired: 'bg-red-400',
  }

  const color = chipStatus[status]

  return (
    <div className={`flex items-center justify-center gap-1`}>
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <p className="text-xs">{status}</p>
    </div>
  )
}