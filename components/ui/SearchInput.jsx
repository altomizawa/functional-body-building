import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

const SearchInput = React.forwardRef(({ className, placeholder = "Search...", ...props }, ref) => {
  return (
    <div className=' border-b border-neutral-300 flex justify-between items-center'>
      <Search className='h-5 w-5 text-neutral-300' />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2 bg-transparent text-xl",
          className
        )}
        {...props}
      />
    </div>
  )
})

SearchInput.displayName = "SearchInput"

export default SearchInput