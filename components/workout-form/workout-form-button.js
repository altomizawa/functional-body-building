

const WorkoutFormButton = ({ className, variant='primary', children , ...props}) => {

  const variantsMap = {
    primary: ' bg-green-500 text-white hover:bg-green-400',
    secondary: ' bg-neutral-800 text-white hover:bg-neutral-600',
    danger: ' bg-red-600 text-white hover:bg-red-400',
    ghost: ' bg-transparent border-2 border-gray-300 text-gray-200 hover:bg-gray-300 hover:text-black',
  }

  return (
    <button className={`${variantsMap[variant]} text-center px-4 py-2 duration-300 ${className}`} {...props}>
      {children}
    </button>
  )
}

export default WorkoutFormButton
