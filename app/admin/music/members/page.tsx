"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

const members = [
  {
    id: 1,
    name: "Alex Rivers",
    role: "Lead Vocals",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    joinDate: "2018",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Lead Guitar",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    joinDate: "2018",
  },
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Band Members</h1>
      </div>

      <div className="flex justify-end">
        <Link href="/admin/music/members/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[150px,1fr] gap-6">
                  <div
                    className="h-40 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <div className="flex items-center mt-2 text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{member.role}</span>
                          <span className="mx-2">•</span>
                          <span>Since {member.joinDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}