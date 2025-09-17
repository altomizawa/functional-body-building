import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import React from 'react'

const BackLink = ({children,  href, ...props}) => {
  return (
    <Link href={href} className='flex item-center justify-center w-min my-12 ml-8 underline-offset-4 duration-500 hover:scale-110 hover:opacity-80' {...props}>
      <ArrowLeft className="mr-2" /> {children}
    </Link>
  )
}

export default BackLink
