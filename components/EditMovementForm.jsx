import { updateMovement } from '@/lib/movementActions'
import useToast from '@/contexts/useToast'

const EditMovementForm = ({setCurrentMovement, movement, setMovements}) => {
  const { setToasts } = useToast()

  const handleSubmit = async (formdata) => {
    const data = {
      name: formdata.get('name'),
      link: formdata.get('link'),
    }
    const id = formdata.get('id')
    
    try{
      const response = await updateMovement(id, data)
      if (!response.success){
        setToasts((prev) => [...prev, {
          title: 'Error',
          description: response.error,
          variant: 'error',
          duration: 5000
        }])
      }
      setToasts((prev) => [...prev, {
        title: 'Success',
        description: 'Movement updated successfully',
        variant: 'success',
        duration: 5000
      }])
      setCurrentMovement(null)
      setMovements([])
    } catch (error) {
      setToasts((prev) => [...prev, {
        title: 'Error',
        description: error.message,
        variant: 'error',
        duration: 5000
      }])
    }
  }


  return ( 
  <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50'>
    <form className='bg-white p-8 rounded-lg flex flex-col gap-4 w-3/4 md:w-1/2 relative' action={handleSubmit}>
      <button type='button' className='absolute top-4 right-4 text-xl' onClick={() => setCurrentMovement(null)}>X</button>
      <h2 className='uppercase font-bold'>Edit Movement</h2>
      <label htmlFor='name'>Name: </label>
      <input type="text" name="name" defaultValue={movement.name} />
      <label htmlFor='link'>Link: </label>
      <input type="text" name="link" defaultValue={movement.link} />
      <input className='hidden' name="id" defaultValue={movement._id} />
      
      <button className='w-full border-2 px-4 py-2 bg-black text-white rounded-lg' type="submit">Submit</button>
    </form>
  </div>
  )
}

export default EditMovementForm
