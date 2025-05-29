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
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import axios from "axios";
import useNotificationStore from "@/store/notification";
import { Badge } from "./ui/badge";
import { GetServerLoading } from "@/utils/GetServerLoading";

export function AppSidebar({ sidebarCollapsed, toggleSidebar, isMobile, items }) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const { setApprovalNotifications, setCraftersNotifications,
    totalNotifications, notifications, setIsUpdate, isFetched, addNotifications } = useNotificationStore()
  useEffect(() => {
    if (session?.user.role === 'admin') {
      const notificationItem = items.find((item) => item.name === 'Notifications');
      if (notificationItem && !isFetched) {
        getNotificationCount()
        fetchReviewSubmissions()
        setIsUpdate(true)
      }
    }
  }, [session])

  console.log('craftersNotification', notifications.craftersNotification)

  const getNotificationCount = async () => {
    try {
      const notifcations = await axios.get('/api/notification/getAllPending')
      if (notifcations.statusText === 'OK') {
        setApprovalNotifications(notifcations.data.data)
        addNotifications(notifcations.data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);

    }
  }

  const fetchReviewSubmissions = async () => {
    try {
      const response = await axios.get('/api/admin/crafters-submission-review');
      if (response.status === 200) {
        const allCrafters = response.data.data;

        // Map over each item and prepare it to be added as an array to setCraftersNotifications
        const newNotifications = allCrafters.map((items) => ({
          orderName: items.musicTemplate,
          Price: items.plan.price,
          PlanName: items.plan.name,
          createdAt: items.submittedCrafter.submittedAtTime,
          crafterId: items.submittedCrafter.assignedCrafterId.crafterId,
          username: items.submittedCrafter.assignedCrafterId.username,
          crafterEmail: items.submittedCrafter.assignedCrafterId.email, // Fixed email field access
          crafterRole: items.submittedCrafter.role,
          submittedFile: {
            fileName: items.submittedCrafter.submittedFileName,
            fileUrl: items.submittedCrafter.submittedFileUrl
          },
          fileUrls: items.submittedCrafter.submittedFileUrl,
        }));
        console.log('newNotifications', newNotifications)
        // Now, pass the newNotifications as an array to setCraftersNotifications
        setCraftersNotifications(newNotifications);
        addNotifications(newNotifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
                        {items.name === 'Notifications'
                          && <Badge
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
