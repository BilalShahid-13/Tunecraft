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
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function AppSidebar({ sidebarCollapsed, toggleSidebar }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useRouter();

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
    <Sidebar className={'relative'}>
      <SidebarHeader className={'flex flex-row justify-center items-center w-full'}>
        {!sidebarCollapsed && (
          <div className="w-full justify-center items-center flex flex-col">
            <Link href={'/'} className="text-4xl font-inter mt-4 cursor-pointer font-semibold text-center text-[#FF7E6E]"
            // onClick={() => navigate.push('/')}
            >
              Tunecraft
            </Link>
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
                  key={items.name}
                  onClick={() => {
                    if (items.name === 'Log out') {
                      handleLogout(); // Trigger the handleLogout function on click
                    } else {
                      navigate.push(items.name); // Navigate for other items
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
                    items?.Icon && <items.Icon className="scale-125" />
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
