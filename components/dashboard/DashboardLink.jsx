import Link from 'next/link'
import { Users, PlusIcon, Pencil, Dumbbell } from 'lucide-react'

const DashboardLink = ({ children, type }) => {
  const linkConfig = {
    users: {
      icon: Users,
      href: "/dashboard/users",
    },
    addWorkout: {
      icon: PlusIcon,
      href: "/dashboard/workouts/add",
    },
    editWorkout: {
      icon: Pencil,
      href: "/dashboard/workouts/edit",
    },
    addExercise: {
      icon: Dumbbell,
      href: "/dashboard/movements",
    }
  }
  const config = linkConfig[type]
  if (!config) return null

  const { icon: IconComponent, className, href } = config

  return (
    <Link href={href} className='text-white text-xl rounded-[10px] uppercase py-12 duration-300 hover:bg-gray-300 hover:text-black px-4 cursor-pointer flex gap-4 justify-center items-center border-[1px] border-gray-300'>
      <IconComponent />
      {children}
    </Link>
  )
}

export default DashboardLink
