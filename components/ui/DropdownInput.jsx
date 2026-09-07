export default function DropdownInput({ name, placeholder, defaultValue, required, options }) {
  return (
    <select className='w-full bg-transparent border-b border-neutral-700 text-xl text-neutral-300' id={name} name={name} defaultValue={defaultValue} required>
      {options.map((option) => (
        <option className='bg-neutral-800 w-full' key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}