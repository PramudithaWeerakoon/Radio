"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Music,
  Calendar,
  Users,
  ShoppingBag,
  FileText,
  Settings,
  Menu,
  X,
  Album,
  Mic2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  {
    icon: Music,
    label: "Music",
    href: "/admin/music",
    subItems: [
      { icon: Album, label: "Albums", href: "/admin/music/albums" },
      { icon: Music, label: "Tracks", href: "/admin/music/tracks" },
      { icon: Users, label: "Members", href: "/admin/music/members" },
    ]
  },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
  { icon: ShoppingBag, label: "Merchandise", href: "/admin/merchandise" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const pathname = usePathname();

  const isSubItemActive = (href: string) => pathname === href;
  const isMainItemActive = (item: any) => {
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isSubItemActive(subItem.href));
    }
    return pathname === item.href;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r",
          "transition-transform lg:translate-x-0",
          !isSidebarOpen && "lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-semibold text-lg"> </span>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setExpandedSection(expandedSection === item.label ? null : item.label)}
                      className={cn(
                        "flex items-center w-full space-x-3 px-4 py-3 rounded-lg transition-colors",
                        "hover:bg-accent",
                        isMainItemActive(item) && "bg-accent",
                        !isSidebarOpen && "lg:justify-center lg:px-2"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {(isSidebarOpen || !isSidebarOpen && window.innerWidth < 1024) && (
                        <span className="flex-1 text-left">{item.label}</span>
                      )}
                      {isSidebarOpen && (
                        <motion.span
                          animate={{ rotate: expandedSection === item.label ? 180 : 0 }}
                          className="h-4 w-4"
                        >
                          ▼
                        </motion.span>
                      )}
                    </button>
                    {expandedSection === item.label && isSidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2"
                      >
                        {item.subItems.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href}>
                            <div
                              className={cn(
                                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                                "hover:bg-accent",
                                isSubItemActive(subItem.href) && "bg-accent"
                              )}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                        "hover:bg-accent",
                        isMainItemActive(item) && "bg-accent",
                        !isSidebarOpen && "lg:justify-center lg:px-2"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {(isSidebarOpen || !isSidebarOpen && window.innerWidth < 1024) && (
                        <span>{item.label}</span>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20",
          "ml-0 p-8"
        )}
      >
        {children}
      </main>
    </div>
  );
}