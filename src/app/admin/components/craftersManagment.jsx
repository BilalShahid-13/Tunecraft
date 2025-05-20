"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { craftersManagmentList } from '@/lib/Constant';
import useAllUsers from "@/store/allUsers";
import useSidebarWidth from '@/store/sidebarWidth';
import axios from "axios";
import { useEffect, useState } from "react";
import ApproveUsers from "./ApproveUsers";
import CustomCard from './CustomCard';
import PendingApproval from "./PendingApproval";
import RejectedUsers from "./RejectedUsers";
import UserCard from './UserCard';
import UserRole from "./UserRole";
import useNotificationStore from "@/store/notification";

const components = [
  UserCard,
  PendingApproval,
  ApproveUsers,
  RejectedUsers,
  UserRole
]

function CustomComopnent({ Component, users, isLoading, index }) {
  return <Component users={users} isLoading={isLoading} />
}

export default function craftersManagment() {
  const { width } = useSidebarWidth()
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { addAllUser, isFetched, setIsUpdate } = useAllUsers()
  const { tabValue, isClicked } = useNotificationStore()
  const [tabValueIndex, setTabValueIndex] = useState(0)
  useEffect(() => {
    fetchAllUsers()
  }, [isFetched])

  useEffect(() => {
    if (tabValue && isClicked) {
      setTabValueIndex(`1`)
    }
  }, [tabValue])

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/fetch-signup-user')
      setAllUsers(res.data.data)
      addAllUser(res.data.data)
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
      <Tabs defaultValue={`${tabValueIndex}`}
        value={`${tabValueIndex}`}
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
         ` : ''}
      `}
            >
              <CustomCard name={items.name} Icon={items.Icon} />
            </TabsTrigger>
          ))}
        </TabsList>


        {components.map((Items, index) => (
          <TabsContent key={index} value={`${index}`} className="mt-6">
            <CustomComopnent
              Component={Items}
              users={allUsers}
              isLoading={loading}
              index={index} />
          </TabsContent>
        ))}
      </Tabs>

    </>
  )
}
