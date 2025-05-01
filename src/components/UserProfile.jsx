"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from "./ui/button"
import { Loader2, LogOut, User } from "lucide-react"
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { data: session } = useSession()
  // const initials = session?.user?.username.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  const [loading, setLoading] = useState(false)
  const [initials, setInitials] = useState(null)
  useEffect(() => {
    let name = session?.user?.username.split(' ').map(word => word.charAt(0).toUpperCase()).join('')
    setInitials(name)
  }, [session])


  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('logout error', error);

    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className={'w-11 h-11'}>
            <AvatarImage src="https://github.com/shadcn.pn" alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={'flex flex-col gap-1 mr-4 justify-start items-start text-left'}>
          <DropdownMenuLabel
            className={'flex flex-row justify-start items-start gap-2 text-left'}>
            <User size={16} />My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={'text-left'}>{session?.user?.username}</DropdownMenuItem>
          <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
          <Button onClick={handleLogout}
            disabled={loading}
            className={'w-full'}>
            {loading ? <Loader2 className="animate-spin" />
              : <LogOut />}
            Logout</Button>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
