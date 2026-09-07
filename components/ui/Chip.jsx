export default function Chip({ status }) {
  return (
    <div className={`flex items-center justify-center gap-1`}>
      <div className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-blue-300' : 'bg-red-400'}`} />
      <p className="text-xs">{status === 'active' ? 'active' : 'inactive'}</p>
    </div>
  )
}