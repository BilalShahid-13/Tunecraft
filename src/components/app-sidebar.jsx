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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarItems } from "@/lib/Constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ sidebarCollapsed, toggleSidebar }) {
  const [selected, setSelected] = useState(null);
  const navigate = useRouter();

  return (
    <Sidebar className={'relative'}>
      <SidebarHeader className={'flex flex-row justify-center items-center w-full'}>
        {!sidebarCollapsed && (
          <div className="w-full">
            <h3 className="text-4xl font-inter mt-4 font-semibold text-center text-[#FF7E6E]">
              Tunecraft
            </h3>
            <div className="bg-gradient-to-r h-[1px] w-full from-red-400/20 via-red-400 to-red-400/20"></div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={'flex flex-col gap-3 px-2 justify-start items-start'}>
          {SidebarItems.map((items, index) => (
            <SidebarMenuItem key={index} className="w-full flex justify-start items-center select-none">
              <TabsList className={`w-full mt-3 h-14 transition-colors duration-100`}>
                <TabsTrigger
                  value={items.name}
                  key={index}
                  className={`dark:data-[state=active]:bg-[#FF7E6E40]
                     px-3 cursor-pointer
            dark:data-[state=active]:text-[#FF7E6E]
                `}
                >
                  {items?.Icon && <items.Icon className={`scale-125`} />}
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
            <TooltipTrigger>
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
