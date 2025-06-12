"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useNotificationStore from '@/store/notification';
import useSidebarWidth from '@/store/sidebarWidth';
import useTabValue from '@/store/tabValue';
import { Suspense, useEffect, useState } from 'react';
import CustomCard from './CustomCard';
import { cn } from "@/lib/utils";
import { Loader } from "@/utils/Skeleton";

function CustomComponent({ Component }) {
  return <Component />
}
export default function AdminTabRoot({ list = craftersManagmentList, componentLists = [], gridSize = 4 }) {
  const { isClicked } = useNotificationStore();
  const { tabValue, userStatus } = useTabValue();
  const { width } = useSidebarWidth();
  const [tabValueIndex, setTabValueIndex] = useState('0');

  useEffect(() => {
    if (tabValue && isClicked) {
      setTabValueIndex(userStatus)
    }
  }, [tabValue])
  return (

    <>
      <Tabs defaultValue={tabValueIndex}
        value={tabValueIndex}
        onValueChange={setTabValueIndex}
        className={'w-full flex'}>
        <TabsList
          className={cn(
            `grid grid-cols-${gridSize} ${gridSize > 3 ? 'grid-rows-2' : ''} place-items-center
     gap-3 mt-3 mb-6
     max-xl:grid max-xl:grid-cols-2
     max-xl:place-items-center
     max-md:grid-cols-2
     max-lg:grid max-lg:place-items-center
     ${width ? "max-lg:grid-cols-3" : "max-lg:grid-cols-1"}
     max-sm:grid max-sm:grid-cols-1
     bg-transparent h-auto w-full`
          )}
        >
          {list.map((items, index) => (
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


        {componentLists.map((Items, index) => (
          <TabsContent key={index} value={`${index}`} className="mt-3">
            <Suspense fallback={<Loader />}>
              <CustomComponent
                Component={Items}
                index={index} />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
