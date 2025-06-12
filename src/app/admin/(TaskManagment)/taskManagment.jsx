"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { taskManagmentList } from '@/lib/Constant';
import useAllUsers from "@/store/allUsers";
import useNotificationStore from "@/store/notification";
import useSidebarWidth from '@/store/sidebarWidth';
import useTabValue from "@/store/tabValue";
import { Loader } from "@/utils/Skeleton";
import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import CustomCard from "../(CrafterManagment)/components/CustomCard";

// const AllCrafters = lazy(() => import('./components/CraftersTab/AllCrafters'));
const PendingCrafters = lazy(() => import('./components/CraftersTab/PendingCrafters'));
const ApprovedCrafter = lazy(() => import('./components/CraftersTab/ApprovedCrafter'));
const AdminTaskCard = lazy(() => import('./components/AdminTaskCard'));

const components = [
  AdminTaskCard,
  PendingCrafters,
  ApprovedCrafter,
  // AllCrafters,
]

function CustomComponent({ Component, users, isLoading, index }) {
  return <Component />
}
export default function taskManagment() {
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
      const res = await axios.get('/api/admin/get-all-Crafters')
      setAllUsers(res.data.data)
      console.log('fetchAllUsers', res.data.data)
      setIsScroll(true);
      addAllUser({ users: res.data.data, mode: "task", task: res.data.data });
      if (res) {
        setIsTaskFetched(false);
      }
    } catch (error) {
      console.error(error.response.data);
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
          className={`grid grid-cols-3 grid-rows-1 place-items-center
          gap-3 mt-3 mb-6  max-xl:grid max-xl:grid-cols-2
          max-xl:place-items-center
          max-md:grid-cols-2
          max-lg:grid max-lg:place-items-center
          ${width ? 'max-lg:grid-cols-3' : 'max-lg:grid-cols-1'}
          max-sm:grid max-sm:grid-cols-1
          bg-transparent h-auto w-full`}
        >
          {taskManagmentList.map((items, index) => (
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
            <Suspense fallback={ <Loader />}>
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
