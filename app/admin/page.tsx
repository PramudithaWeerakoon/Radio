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
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// This is a Server Component, so we can fetch data directly
export default async function AdminDashboard() {
  // Fetch data directly in the component
  const stats = await prisma.stat.findMany();
  const quickActions = await prisma.quickAction.findMany();
  const recentActivity = await prisma.recentActivity.findMany();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Album className="h-4 w-4 text-muted-foreground" />
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
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quickActions.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
            style={{ animationDelay: `${400 + sectionIndex * 100}ms` }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.items && section.items.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
                        <FileText className="h-6 w-6" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className="opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
        style={{ animationDelay: '600ms' }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4">
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
      </div>
    </div>
  );
}