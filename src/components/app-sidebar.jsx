"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAllUsers from "@/store/allUsers";
import useNotificationStore from "@/store/notification";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchAllCrafterTask from "./serverComponents/fetchAllCrafterTasks";
import getNotificationCount from "./serverComponents/getNotificationCount";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ sidebarCollapsed, toggleSidebar, isMobile, items }) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const { totalNotifications, setIsUpdate, isFetched, addNotifications } = useNotificationStore()
  const { addAllUser, setIsUpdate: setIsUpdateTask } = useAllUsers()


  useEffect(() => {
    if (session?.user.role === 'admin') {
      const notificationItem = items.find((item) => item.name === 'Notifications');
      if (notificationItem && !isFetched) {
        getNotification();
        getAllCrafterTasks();
        setIsUpdate(true)
      }
    }
  }, [session])

  async function getNotification() {
    try {
      const notificationCount = await getNotificationCount();
      addNotifications(notificationCount)
    } catch (error) {
      console.error('error in getting notifications', error);
    }
  }


  async function getAllCrafterTasks() {
    try {
      const { notification, allUser, isUpdateTask } = await fetchAllCrafterTask();
      console.log('getAllCrafterTasks', notification, allUser, isUpdateTask)
      addNotifications(notification);
      addAllUser(allUser);
      setIsUpdateTask(isUpdateTask);
    } catch (error) {
      console.error('error in getting all crafter tasks', error);

    }
  }

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
    <Sidebar className={'relative h-screen'}>
      <SidebarHeader className={'flex flex-row justify-center items-center w-full'}>
        {isMobile ?
          <div className="w-full justify-center items-center flex flex-col">
            <Link href={'/'} className="text-4xl font-inter mt-4 cursor-pointer font-semibold text-center text-[#FF7E6E]"
            >
              Tunecraft
            </Link>
            <div className="bg-gradient-to-r h-[1px] w-full from-red-400/20 via-red-400 to-red-400/20"></div>
          </div> : !sidebarCollapsed && (
            <div className="w-full justify-center items-center flex flex-col">
              <Link href={'/'} className="text-4xl font-inter mt-4 cursor-pointer font-semibold text-center text-[#FF7E6E]"
              >
                Tunecraft
              </Link>
              <div className="bg-gradient-to-r h-[1px] w-full from-red-400/20 via-red-400 to-red-400/20"></div>
            </div>
          )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={'flex flex-col gap-3 px-2 justify-start items-start'}>
          {items.map((items, index) => (
            <SidebarMenuItem key={index} className="w-full flex justify-start items-center select-none">
              <TabsList className={`w-full mt-3 h-14 transition-colors duration-100`}>
                <TabsTrigger
                  value={items.name}
                  key={items.name}
                  onClick={() => {
                    if (items.name === 'Log out') {
                      handleLogout();
                    }
                  }}
                  className={`dark:data-[state=active]:bg-[#FF7E6E40]
        px-3 cursor-pointer
        flex flex-row justify-start items-center gap-6
        dark:data-[state=active]:text-[#FF7E6E]`}
                >
                  {items.name === 'Log out' ? (
                    loading ? (
                      <Loader2 className="animate-spin scale-125" /> // Loader shows when loading is true
                    ) : (
                      <items.Icon className="scale-125" /> // Show logout icon when not loading
                    )
                  ) : (
                    <div className="flex relative">
                      {items?.Icon && <items.Icon className="scale-125" />}
                      <div className="flex absolute -top-3 left-1">
                        {(items.name === 'Notifications')
                          && totalNotifications > 0 && <Badge
                            className={'scale-75 bg-red-400 text-white'}>{totalNotifications}</Badge>}</div>
                    </div>
                  )}
                  <p>{items.name}</p>
                </TabsTrigger>
              </TabsList>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className={'justify-end items-end flex'}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {!sidebarCollapsed && (
                <SidebarTrigger onClick={toggleSidebar} />
              )}
            </TooltipTrigger>
            <TooltipContent>
              Close Sidebar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


      </SidebarFooter>
    </Sidebar>
  );
}
