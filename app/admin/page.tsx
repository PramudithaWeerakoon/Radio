"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Music,
  Users,
  Calendar,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Album,
  Mic,
  Radio,
} from "lucide-react";

const stats = [
  {
    title: "Total Albums",
    value: "5",
    change: "+20%",
    trend: "up",
    icon: Album,
  },
  {
    title: "Active Events",
    value: "12",
    change: "+15%",
    trend: "up",
    icon: Calendar,
  },
  {
    title: "Band Members",
    value: "4",
    change: "0%",
    trend: "neutral",
    icon: Users,
  },
  {
    title: "Merchandise Sales",
    value: "$12.5k",
    change: "-5%",
    trend: "down",
    icon: ShoppingBag,
  },
];

const quickActions = [
  {
    title: "Music",
    items: [
      { label: "Add Album", href: "/admin/music/albums/new", icon: Album },
      { label: "Add Track", href: "/admin/music/tracks/new", icon: Music },
      { label: "Add Member", href: "/admin/music/members/new", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "New Event", href: "/admin/events/new", icon: Calendar },
      { label: "New Post", href: "/admin/blog/new", icon: FileText },
      { label: "Add Product", href: "/admin/merchandise/new", icon: ShoppingBag },
    ],
  },
];

const recentActivity = [
  {
    action: "New album added",
    description: "Echoes of Tomorrow was added to the catalog",
    timestamp: "2 hours ago",
  },
  {
    action: "Event updated",
    description: "Summer Stadium Tour date modified",
    timestamp: "5 hours ago",
  },
  {
    action: "New merchandise",
    description: "Added new t-shirt designs to the store",
    timestamp: "1 day ago",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quickActions.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + sectionIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.items.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
                        <item.icon className="h-6 w-6" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}