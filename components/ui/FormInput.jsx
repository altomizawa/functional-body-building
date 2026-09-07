export default function FormInput({ name, placeholder, defaultValue, required, uppercase }) {
  return (
    <input className={`w-full ${uppercase ? 'uppercase' : ''} bg-transparent border-b border-neutral-700 text-xl text-neutral-300`} type="text" name={name} placeholder={placeholder} defaultValue={defaultValue} required />
  )
}