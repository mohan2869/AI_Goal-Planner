import React from 'react'
import { Link } from 'react-router-dom'
import ProfileInfo from '../ProfileInfo'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
const Navbar = () => {
  return (
    <div> <div className='bg-white flex items-center justify-between px-11 py-2 drop-shadow '>
    <Link to='/'>
        <h2 className='text-xl font-medium text-black py-2 '>
            <span className='font-bold leading-none'>Goal</span>
            <span className='text-slate-900'>Genie</span>
        </h2>
    </Link>
    
    <ProfileInfo  />
</div> </div>
  )
}

export default Navbar