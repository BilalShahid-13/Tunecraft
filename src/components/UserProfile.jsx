"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut, User } from "lucide-react";
import { signOut } from 'next-auth/react';
import { useEffect, useState, useTransition } from "react";
import UserProfileAction from "./serverComponents/UserProfile";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from "./ui/button";

export default function UserProfile() {
  const [session, setSession] = useState({ email: "", username: "", role: "" });
  useEffect(() => {
    async function fetchSession() {
      const res = await UserProfileAction();
      setSession({
        email: res.email,
        username: res.username,
        role: res.role
      });
    }
    fetchSession();
  }, [])



  const [isPending, startTransition] = useTransition()
  const [initials, setInitials] = useState(null)
  useEffect(() => {
    let name = session?.username.split(' ').map(word => word.charAt(0).toUpperCase()).join('')
    setInitials(name)
  }, [session])


  const handleLogout = async () => {
    startTransition(() => {
      signOut({ callbackUrl: '/' });
    })
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
            className={'flex flex-row justify-start w-full items-start gap-2 text-left'}>
            <User size={16} />My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={'text-left w-full'}>{session?.username}</DropdownMenuItem>
          <DropdownMenuItem>{session?.email}</DropdownMenuItem>
          <Button onClick={handleLogout}
            disabled={isPending}
            className={'w-full primary-btn'}>
            {isPending ? <Loader2 className="animate-spin" />
              : <LogOut />}
            Logout</Button>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
