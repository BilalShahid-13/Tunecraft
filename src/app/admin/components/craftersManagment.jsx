"use client";
import { craftersManagmentList } from '@/lib/Constant'
import React, { useEffect } from 'react'
import CustomCard from './CustomCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserCard from './UserCard'
import axios from 'axios';

const components = [
  UserCard
]
export default function craftersManagment() {
  const [allUsers, setAllUsers] = React.useState([])
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/fetch-signup-user')
      // console.log(res.data.data)
      setAllUsers(res.data.data)
    } catch (error) {
      console.error(error);

    }
  }

  return (
    <>
      <Tabs defaultValue={'0'}>
        <TabsList className="flex gap-3 mt-3 bg-transparent">
          {craftersManagmentList.map((items, index) => (
            <TabsTrigger
              key={index}  // key should be applied to the TabsTrigger
              value={`${index}`}
              className="h-auto bg-transparent cursor-pointer p-0 m-0 px-0 py-0 dark:data-[state=active]:bg-transparent"
            >
              <CustomCard name={items.name} Icon={items.Icon} />
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className='mt-10 h-[90vh]'>
          {components.map((Items, index) => (
            <TabsContent key={index} value={`${index}`}>
              <Items allUsers={allUsers}/>
            </TabsContent>
          ))}
        </ScrollArea>

      </Tabs>


    </>
  )
}
