"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarItems } from "@/lib/Constant"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AppSidebar({ sidebarCollapsed }) {
  const [selected, setSelected] = useState(null)
  const navigate = useRouter()
  return (
    <Sidebar
    // collapsible="icon"
    >
      <SidebarHeader>
        {!sidebarCollapsed && <h3 className="text-4xl font-inter mt-4
        font-semibold text-center text-[#FF7E6E]">Tunecraft</h3>}
        {!sidebarCollapsed && <div className="bg-gradient-to-r h-[1px]
         from-red-400/20 via-red-400 to-red-400/20"></div>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu
          className={'flex flex-col gap-3 px-2 justify-start items-start'}>
          {SidebarItems.map((items, index) => (
            <SidebarMenuItem key={index}
              className={''}>
              <TabsList className={`py-7 rounded-xs cursor-pointer w-full
                  transition-all duration-150 ease-in-out justify-start items-center
                  hover:bg-[#FF7E6E40]
                `}>
                <TabsTrigger value="account" >
                  <div
                    className="flex flex-row justify-start
                  items-center gap-4 text-lg font-inter">
                    {items.Icon && <items.Icon className="scale-125" />}
                    <Link href={items.route}>{items.name}</Link>
                    {/* {items.name} */}
                  </div>
                </TabsTrigger>
              </TabsList>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
