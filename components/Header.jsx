import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

async function Header() {
  try {
    await checkUser();
  } catch (error) {
    console.log("checkuser failed", error)
  }
  return (
    
    <div className='fixed top-0 w-full z-50 bg-[#F8F8FF] backdrop-blur-md border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-4 py-4'>
        <nav className='flex justify-between items-center'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center hover:opacity-80 transition-opacity'>
              <Image 
                width={40} 
                height={40} 
                alt='logo' 
                src={'/final-final-logo.png'}
                className='rounded-lg'
              />
              <span className='ml-3 text-xl font-bold text-gray-900 hidden sm:block'>
                MoneyPal
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className='flex items-center space-x-4'>
            <SignedIn>
              <div className='hidden md:flex items-center space-x-3'>
                <Link  href='/dashboard'>
                  <Button 
                    variant='ghost' 
                    className='text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors'
                  >
                    <LayoutDashboard className='w-4 h-4 mr-2' />
                    Dashboard
                  </Button>
                </Link>
                <Link href={'/transaction/create'}>
                  <Button 
                    className=' text-white cursor-pointer shadow-sm transition-colors'
                  >
                    <PenBox className='w-4 h-4 mr-2' />
                    Add Transaction
                  </Button>
                </Link>
              </div>
              
              {/* Mobile Menu - Show icons only on small screens */}
              <div className='flex md:hidden items-center space-x-2'>
                <Link href="/dashboard">
                  <Button size='sm' variant='ghost'>
                    <LayoutDashboard className='w-4 h-4' />
                  </Button>
                </Link>
                <Link href={'/transaction/create'}>
                  <Button size='sm' className='bg-black hover:bg-gray-800'>
                    <PenBox className='w-4 h-4' />
                  </Button>
                </Link>
              </div>

            </SignedIn>
                  <SignedOut>
                    <SignInButton forceRedirectUrl='/dashboard'>
                      <Button 
                        className='cursor-pointer text-white shadow-sm transition-colors px-6'
                      >
                        Login
                      </Button>
                    </SignInButton>
                  </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-gray-200 hover:ring-gray-300 transition-all",
                    userButtonPopoverCard: "shadow-lg border-gray-200"
                  }
                }}
              />
            </SignedIn>

          </div>
        </nav>
      </div>
    </div>
  )
}

export default Header
