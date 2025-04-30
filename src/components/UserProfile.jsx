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
import { LogOut, User } from "lucide-react"

export default function UserProfile() {
  const { data: session } = useSession()
  const initials = session?.user?.username.split(' ').map(word => word.charAt(0).toUpperCase()).join('');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className={'w-11 h-11'}>
            <AvatarImage src="https://github.com/shadcn.pn" alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={'flex flex-col gap-1'}>
          <DropdownMenuLabel
            className={'flex flex-row justify-center items-center gap-2'}>
            <User size={16} />My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session?.user?.username}</DropdownMenuItem>
          <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
          <Button onClick={() => signOut()}
            className={'w-full'}>
            <LogOut />
            Logout</Button>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
