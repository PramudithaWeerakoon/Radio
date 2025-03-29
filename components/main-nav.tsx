"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Music, Users, Calendar, MessageSquare, ShoppingBag } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: Music,
  },
  {
    href: "/members",
    label: "Band Members",
    icon: Users,
  },
  {
    href: "/events",
    label: "Events",
    icon: Calendar,
  },
  {
    href: "/chat",
    label: "Fan Chat",
    icon: MessageSquare,
  },
  {
    href: "/merchandise",
    label: "Store",
    icon: ShoppingBag,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <span className="font-bold text-xl">Midnight Echo</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "flex items-center space-x-2",
                  pathname === route.href && "bg-accent text-accent-foreground"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex md:hidden">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}