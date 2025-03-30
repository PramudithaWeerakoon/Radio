"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const roles = [
  "Lead Vocals",
  "Lead Guitar",
  "Rhythm Guitar",
  "Bass",
  "Drums",
  "Keyboard",
  "Other"
];

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/music/members">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Band Member</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="Enter first name" />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Enter last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profile Image URL</Label>
              <Input placeholder="Enter profile image URL" />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Enter member biography"
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input placeholder="Enter Facebook profile URL" />
                </div>
                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <Input placeholder="Enter Twitter profile URL" />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input placeholder="Enter Instagram profile URL" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input type="date" />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button>Add Member</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}