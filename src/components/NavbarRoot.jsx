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
import useSidebarWidth from "@/store/sidebarWidth";
import useTabValue from "@/store/tabValue";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from './app-sidebar';
import DashboardNavbar from "./DashboardNavbar";
import Navbar from "./Navbar";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function NavbarRoot() {
  const location = usePathname();
  const [isProtectedRoute, setIsProtectedRoute] = useState(false);
  const [isAdmin, setAdmin] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const protectedRoutes = roles.map((r) => `/${r.route}`);
  const isMobile = useMediaQuery({ query: "(max-width: 639px)" });
  const items = isAdmin ? adminPanel : SidebarItems;
  const { addSidebarWidth } = useSidebarWidth()
  const { setTabValue, tabValue, userStatus } = useTabValue()

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
    setTabValue((isAdmin ? tabValue
      : 'Tasks'))
  }, [items])

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
              defaultValue={`${(isAdmin ? adminPanel[0].name
                : 'Dashboard')}`}
              value={tabValue}
              onValueChange={setTabValue}
              className="flex flex-row justify-start items-start w-full"
            >
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
                  <div>
                    {items.map((item) => (
                      <TabsContent key={item.name}
                        value={item.name} className="p-4">
                        <item.route />
                      </TabsContent>
                    ))}
                  </div>
                </ScrollArea>
              </main>
            </Tabs>
          </SidebarProvider >
        ) : (
          <Navbar />
        )
        }
      </div >
    </>
  );
}