import Link from 'next/link'

const DashboardContainer = ({ children }) => {
  return (
     <main className="grid grid-cols-2 gap-4 w-[90%] md:w-3/4 lg:w-1/2">
      {children}
    </main>
  )
}

export default DashboardContainer
