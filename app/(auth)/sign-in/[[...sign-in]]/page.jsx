import { SignedOut, SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return(
    <div className=''>
    <SignIn/>
    </div>
  )
  
}

export default page