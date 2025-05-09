"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { adminPanel, roles, SidebarItems } from '@/lib/Constant';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from './app-sidebar';
import DashboardNavbar from "./DashboardNavbar";
import Navbar from "./Navbar";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import useSidebarWidth from "@/store/sidebarWidth";

export default function NavbarRoot() {
  const location = usePathname();
  const [isProtectedRoute, setIsProtectedRoute] = useState(false);
  const [isAdmin, setAdmin] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const protectedRoutes = roles.map((r) => `/${r.route}`);
  const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
  const items = isAdmin ? adminPanel : SidebarItems;
  const { addSidebarWidth } = useSidebarWidth()
  useEffect(() => {
    setIsProtectedRoute(protectedRoutes.includes(location));
    if (location === '/admin') {
      setAdmin(true)
    }
  }, [location, protectedRoutes]);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile])

  useEffect(() => {
    addSidebarWidth(sidebarCollapsed)
  }, [sidebarCollapsed])

  function toggleSidebar() {
    setSidebarCollapsed(prevState => !prevState);
  };

  function roleBasedItem() {
    if (isAdmin) {
      return adminPanel[0].name
    } else {
      return SidebarItems[0].name
    }
  }

  useEffect(() => {

  }, [isAdmin])


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
            <Tabs
              defaultValue={isAdmin ? adminPanel[0].name
                : SidebarItems[0].name}
              className="w-full flex flex-row justify-start items-start">
              <AppSidebar sidebarCollapsed={sidebarCollapsed}
                isMobile={isMobile}
                items={items}
                toggleSidebar={toggleSidebar} />
              <main
                className={`relative transition-all duration-300
                  p-0 w-full m-0`}
              >
                {/* sidebar trigger */}
                <div className='flex flex-row justify-start items-start bg-background w-full'>
                  <div className="inline-block max-sm:mt-1 justify-center items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isMobile ? <SidebarTrigger
                            onClick={toggleSidebar}
                            className={`relative left-0 top-2`}
                          /> : sidebarCollapsed && (
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
                  {items.map((items, index) => (
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