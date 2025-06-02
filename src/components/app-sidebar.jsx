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
import useAllUsers from "@/store/allUsers";

export function AppSidebar({ sidebarCollapsed, toggleSidebar, isMobile, items }) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const { setApprovalNotifications, setCraftersNotifications,
    totalNotifications, setIsUpdate, isFetched, addNotifications, allNotifications } = useNotificationStore()
  const { addAllUser, setIsUpdate: setIsUpdateTask } = useAllUsers()


  useEffect(() => {
    if (session?.user.role === 'admin') {
      const notificationItem = items.find((item) => item.name === 'Notifications');
      if (notificationItem && !isFetched) {
        getNotificationCount()
        fetchReviewSubmissions()
        fetchCraftersPlenty()
        fetchAllCrafterTasks();
        setIsUpdate(true)
      }
    }
  }, [session])

  const getNotificationCount = async () => {
    try {
      const notifcations = await axios.get('/api/notification/getAllPending')
      if (notifcations.statusText === 'OK') {
        setApprovalNotifications(notifcations.data.data)
        const data = notifcations.data.data;
        const newNotifications = data.map((items) => (
          {
            orderName: items.musicTemplate,
            submittedAtTime: items.submittedAtTime,
            createdAt: items.updatedAt,
            approvalStatus: items.approvalStatus,
            status: "Crafter Registration",
            crafterId: items?.crafterId,
            _id: items._id,
            username: items.username,
            role: items.role,
          }
        ))
        addNotifications(newNotifications)
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
        const newNotifications = allCrafters.map((items) => (
          {
            orderName: items.musicTemplate,
            createdAt: items.submittedCrafter.submittedAtTime,
            updatedAt: items.updatedAt,
            // approvalStatus: items.approvalStatus,
            approvalStatus: "pending",
            status: "Task Submission",
            orderId: items?.orderId,
            // _id: items?.orderId,
            _id: items.submittedCrafter.assignedCrafterId._id,
            username: items.name,
            role: items.submittedCrafter.assignedCrafterId.role,
          }
        ))
        addNotifications(newNotifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCraftersPlenty = async () => {
    try {
      const response = await axios.get('/api/crafter-penalties-detailed');
      if (response.status === 200) {
        const allPlentyCrafters = response.data.data;
        console.log('allPlentyCrafters', allPlentyCrafters)
        /**
         addNotifications({

         })
         *
         */
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchAllCrafterTasks = async () => {
    try {
      const res = await axios.get('/api/admin/get-allApproved-Crafters')
      console.log('all-users', res.data.data)
      // setAllCrafter(res.data.data)
      // setIsScroll(true);
      addAllUser({ users: res.data.data, mode: "task", task: res.data.data });
      if (res.status === 200) {
        setIsUpdateTask(false);
      }
    } catch (error) {
      console.error(error.response.data);
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
