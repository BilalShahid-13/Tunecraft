"use client";
import { NavbarItem, roles } from '@/lib/Constant';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

function Navbar() {
  const [active, setActive] = useState(0);
  const { data: session } = useSession();
  const role = roles.find((r) => r.name === session?.user?.role);
  const location = usePathname();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  // Handle clicking on navbar items
  const handleClick = (index) => {
    setActive(index);
  };

  useEffect(() => {
    // You can remove or refine this code for production if needed
    console.log(session);
    console.log('role', role?.route);
  }, [session]);

  // Check if the current location is not the 'Questions' or 'Register' page
  const isProtectedPage = !(location === '/Questions' || location === '/Register');

  return (
    <div className="bg-black grid grid-cols-2 max-lg:items-center max-lg:justify-between p-4 max-lg:flex max-lg:flex-row max-xl:flex max-xl:flex-row max-xl:justify-between max-md:flex max-md:flex-row max-md:items-center max-sm:flex max-sm:flex-row max-sm:items-center">
      <Link href="/" className="text-4xl uppercase font-bold text-[#ff7e6e] max-sm:text-2xl">tunecraft</Link>

      {/* Navbar items */}
      <div className={`max-sm:hidden max-md:hidden flex flex-row justify-center max-lg:hidden max-xl:hidden gap-24 items-center text-lg font-medium`}>
        {isProtectedPage &&
          NavbarItem.map((item, index) => (
            <Link href={item.route} key={index}
              className={`${active === index ? 'text-white' : 'text-[#919191]'}`}
              onClick={() => setActive(index)}
            >
              {item.name}
            </Link>
          ))}
      </div>

      {/* Dropdown for mobile/tablet */}
      {isProtectedPage && !isDesktop &&
        <DropdownMenu className="max-sm:flex max-md:flex hidden max-lg:flex xl:hidden" style={{ position: 'relative' }}>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black">
            <DropdownMenuLabel>Menubar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NavbarItem.map((items, index) =>
              <DropdownMenuItem key={index}>
                <Link href={items.route}>{items.name}</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </div>
  );
}

export default Navbar;
