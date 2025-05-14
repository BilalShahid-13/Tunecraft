"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAllUsers from '@/store/allUsers';
import { useEffect, useState } from 'react';
import UserCard from "./UserCard";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function UserRole() {
  const { allUser } = useAllUsers();
  const [userRole, setUserRole] = useState({
    lyricist: [],
    singer: [],
    engineer: []
  });

  useEffect(() => {
    console.log("All Users:", allUser); // Debugging line to check the users
    if (allUser) {
      const lyricists = allUser.filter(user => user.role === "lyricist");
      const singers = allUser.filter(user => user.role === "singer");
      const engineers = allUser.filter(user => user.role === "engineer");
      setUserRole({
        lyricist: lyricists,
        singer: singers,
        engineer: engineers
      });
    }
  }, [allUser]);

  return (
    <>
      <Accordion type="single" collapsible
        className={'flex flex-col gap-3'}>
        {userRole.lyricist.length > 0 && <AccordionItem value="item-1" className={'cursor-pointer bg-zinc-900 px-3 rounded-md'}>
          <AccordionTrigger className={'cursor-pointer text-zinc-400 font-normal text-sm font-inter flex items-center gap-2'}>
            Lyricist
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[340px] w-full rounded-md p-4">
              <div className={'space-y-12'}>
                <UserCard users={userRole.lyricist.map((items) => items)}
                  userRole={true} />
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>}

        {userRole.singer.length > 0 && <AccordionItem value="item-2" className={'cursor-pointer bg-zinc-900 px-3 rounded-md'}>
          <AccordionTrigger className={'cursor-pointer text-zinc-400 font-normal text-sm font-inter flex items-center gap-2'}>
            Singer
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[340px] w-full rounded-md p-4">
              <div className={'space-y-12'}>
                <UserCard users={userRole.singer.map((items) => items)}
                  userRole={true} />
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>}

        {userRole.engineer.length > 0 && <AccordionItem value="item-3" className={'cursor-pointer bg-zinc-900 px-3 rounded-md'}>
          <AccordionTrigger className={'cursor-pointer text-zinc-400 font-normal text-sm font-inter flex items-center gap-2'}>
            Engineer
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[340px] w-full rounded-md p-4">
              <div className={'space-y-12'}>
                <UserCard users={userRole.engineer.map((items) => items)}
                  userRole={true} />
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>}
      </Accordion>
    </>
  );
}
