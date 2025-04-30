"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { roles } from '@/lib/Constant';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function NavbarRoot() {
  const location = usePathname();
  const [isProtectedRoute, setIsProtectedRoute] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track sidebar state

  const protectedRoutes = roles.map((r) => `/${r.route}`);

  useEffect(() => {
    // Check if the current location is one of the protected routes
    setIsProtectedRoute(protectedRoutes.includes(location));
  }, [location, protectedRoutes]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prevState => !prevState); // Toggle sidebar state
  };

  return (
    <>
      <SidebarProvider
        className={'overflow-hidden'}
        style={{
          "--sidebar-width": sidebarCollapsed ? "5rem" : "20rem", // Adjust sidebar width
          "--sidebar-width-mobile": sidebarCollapsed ? "5rem" : "20rem",
        }}>
        <Tabs defaultValue="account"
          className="w-full p-4"
        >
          <AppSidebar sidebarCollapsed={sidebarCollapsed} />
          <main
            className={`w-full transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[20rem]' // Adjust main content width
              }`}>
            {/* Trigger button to toggle sidebar */}
            <SidebarTrigger
              onClick={toggleSidebar} // Add event handler to toggle sidebar
              className={'z-50'}
            />
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </main>
        </Tabs>
      </SidebarProvider>

      {/* {isProtectedRoute ?
        <SidebarProvider>
          <AppSidebar />
          <main className='w-full'>
            <DashboardNavbar link={location} />
            <SidebarTrigger />
          </main>
        </SidebarProvider>
        : <Navbar />} */}
    </>
  );
}
