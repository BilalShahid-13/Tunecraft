"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { craftersManagmentList } from '@/lib/Constant';
import useAllUsers from "@/store/allUsers";
import useNotificationStore from "@/store/notification";
import useSidebarWidth from '@/store/sidebarWidth';
import useTabValue from "@/store/tabValue";
import { Loader } from "@/utils/Skeleton";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

const UserCard = lazy(() => import("./UserCard"));
const CustomCard = lazy(() => import("./CustomCard"));
const PendingApproval = lazy(() => import("./PendingApproval"));
const ApproveUsers = lazy(() => import("./ApproveUsers"));
const RejectedUsers = lazy(() => import("./RejectedUsers"));
const UserRole = lazy(() => import("./UserRole"));

const components = [
  UserCard,
  PendingApproval,
  ApproveUsers,
  RejectedUsers,
  UserRole
]

function CustomComponent({ Component, users, isLoading, index }) {
  return <Component users={users} isLoading={isLoading} />
}

export default function craftersManagment() {
  const { width } = useSidebarWidth()
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { addAllUser, isFetched, setIsUpdate } = useAllUsers()
  const { isClicked } = useNotificationStore()
  const { tabValue, userStatus } = useTabValue()
  const [tabValueIndex, setTabValueIndex] = useState('0')
  useEffect(() => {
    fetchAllUsers()
  }, [isFetched])

  useEffect(() => {
    if (tabValue && isClicked) {
      setTabValueIndex(userStatus)
    }
  }, [tabValue])

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/fetch-signup-user')
      setAllUsers(res.data.data)
      addAllUser({ users: res.data.data, mode: "crafters", task: res.data.data });
      if (res) {
        setIsUpdate(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <Tabs defaultValue={tabValueIndex}
        value={tabValueIndex}
        onValueChange={setTabValueIndex}
        className={'w-full flex'}>
        <TabsList
          className={`grid grid-cols-4 grid-rows-2 place-items-center
          gap-3 mt-3 mb-6  max-xl:grid max-xl:grid-cols-2
          max-xl:place-items-center
          max-md:grid-cols-2
          max-lg:grid max-lg:place-items-center
          ${width ? 'max-lg:grid-cols-3' : 'max-lg:grid-cols-1'}
          max-sm:grid max-sm:grid-cols-1
          bg-transparent h-auto w-full`}
        >
          {craftersManagmentList.map((items, index) => (
            <TabsTrigger
              key={index}
              value={`${index}`}
              className={`h-auto p-0 m-0 cursor-pointer w-full
        dark:data-[state=active]:bg-transparent
        rounded-xl transition-all
        dark:data-[state=active]:border-[#ff7e6e]
        max-sm:w-full
        ${index >= 4 ? `col-span-4 max-md:col-span-2
        max-sm:col-span-1 max-xl:col-span-2 max-lg:col-span-1
         ` : ''}`}
            >
              <CustomCard name={items.name} Icon={items.Icon} />
            </TabsTrigger>
          ))}
        </TabsList>


        {components.map((Items, index) => (
          <TabsContent key={index} value={`${index}`} className="mt-6">
            <Suspense fallback={
              <Loader />
            }>
              <CustomComponent
                Component={Items}
                users={allUsers}
                isLoading={loading}
                index={index} />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>

    </>
  )
}
