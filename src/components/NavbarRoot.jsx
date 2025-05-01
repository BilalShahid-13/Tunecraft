"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { roles, SidebarItems } from '@/lib/Constant';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from './app-sidebar';
import DashboardNavbar from "./DashboardNavbar";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { ScrollArea } from "./ui/scroll-area";

export default function NavbarRoot() {
  const location = usePathname();
  const [isProtectedRoute, setIsProtectedRoute] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const protectedRoutes = roles.map((r) => `/${r.route}`);

  useEffect(() => {
    setIsProtectedRoute(protectedRoutes.includes(location));
  }, [location, protectedRoutes]);

  function toggleSidebar() {
    setSidebarCollapsed(prevState => !prevState);
  };

  return (
    <>
      <div>
        {isProtectedRoute ? (
          <SidebarProvider
            className={`relative w-full transition-opacity duration-150`}
            style={{
              "--sidebar-width": sidebarCollapsed ? "0rem" : "20rem",
              "--sidebar-width-mobile": sidebarCollapsed ? "0rem" : "20rem",
            }}
          >
            <Tabs defaultValue="account" className="w-full flex flex-row justify-start items-start">
              <AppSidebar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
              <main
                className={`relative transition-all duration-300
                  p-0 w-full m-0`}
              >
                <div className='flex flex-row'>
                  <div className="justify-center items-center inline-block">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {sidebarCollapsed && (
                            <SidebarTrigger
                              onClick={toggleSidebar}
                              className={`relative left-0 top-2`}
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open Sidebar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <DashboardNavbar link={location} />
                </div>

                {/* Scrollable content area - only this part will scroll */}
                <ScrollArea style={{
                  height: 'calc(100vh - 64px)' // Adjust based on your navbar height
                }}>
                  {SidebarItems.map((items, index) => (
                    <TabsContent
                      key={index}
                      value={items.name}
                      className="p-4" // Add padding if needed
                    >
                      <items.route />
                    </TabsContent>
                  ))}
                </ScrollArea>
              </main>
            </Tabs>
          </SidebarProvider>
        ) : (
          <Navbar />
        )}
      </div>
    </>
  );
}