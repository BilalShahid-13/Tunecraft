"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { craftersManagmentList } from '@/lib/Constant';
import useSidebarWidth from '@/store/sidebarWidth';
import CustomCard from './CustomCard';
import UserCard from './UserCard';
import PendingApproval from "./PendingApproval";
import { useEffect, useState } from "react";
import axios from "axios";
import useAllUsers from "@/store/allUsers";
import ApproveUsers from "./ApproveUsers";

const components = [
  UserCard,
  PendingApproval,
  ApproveUsers
]

function CustomComopnent({ Component, users, isLoading }) {
  return <Component users={users} isLoading={isLoading} />
}

export default function craftersManagment() {
  const { width } = useSidebarWidth()
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { addAllUser, isFetched, setIsUpdate } = useAllUsers()

  useEffect(() => {
    fetchAllUsers()
  }, [isFetched])

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
      <Tabs defaultValue="2">
        <TabsList
          className={`flex flex-row gap-3 mt-3 mb-6
          max-xl:grid max-lg:grid max-lg:place-items-center
             max-xl:grid-cols-2 bg-transparent
             max-xl:place-items-center
          ${width ? 'max-lg:grid-cols-2' : 'max-lg:grid-cols-1'}
             max-sm:grid max-sm:grid-cols-1 w-auto
               h-auto max-lg:w-full`}
        >
          {craftersManagmentList.map((items, index) => (
            <TabsTrigger
              key={index}
              value={`${index}`}
              className={`h-auto cursor-pointer
dark:data-[state=active]:border-[#ff7e6e]
              ${width ? 'max-lg:w-fit max-xl:w-full' : 'max-lg:w-full'}
                   p-0 m-0 w-fit max-sm:w-full
                   dark:data-[state=active]:bg-transparent
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
              isLoading={loading} />
          </TabsContent>
        ))}
      </Tabs>

    </>
  )
}
