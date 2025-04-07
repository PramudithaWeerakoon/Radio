"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card"; // Verify these exports
import { Button } from "@/components/ui/button"; // Verify this export
import { Input } from "@/components/ui/input"; // Verify this export
import { Label } from "@/components/ui/label"; // Verify this export
import { Textarea } from "@/components/ui/textarea"; // Verify this export
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Verify these exports
import { ArrowLeft } from "lucide-react"; // Ensure this is correctly imported
import Link from "next/link"; // This should be correct
import { useRouter } from "next/navigation"; // Add this import
import { useToast } from "@/components/ui/use-toast"; // Add this import for consistent notifications

const roles = [
  "Lead Vocals",
  "Lead Guitar",
  "Rhythm Guitar",
  "Bass",
  "Drums",
  "Keyboard",
  "Other",
];

export default function NewMemberPage() {
  const router = useRouter(); // Initialize the router
  const { toast } = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    profileImageUrl: "",
    bio: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    joinDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/members", { // Ensure this path matches the server-side route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Member added successfully"
        });
        // Redirect to the members list page
        router.push("/admin/music/members");
      } else {
        toast({
          title: "Error",
          description: "Failed to add member",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select onValueChange={handleRoleChange}>
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
              <Input
                name="profileImageUrl"
                placeholder="Enter profile image URL"
                value={formData.profileImageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                name="bio"
                placeholder="Enter member biography"
                className="min-h-[150px]"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    name="facebook"
                    placeholder="Enter Facebook profile URL"
                    value={formData.socialLinks.facebook}
                    onChange={handleSocialLinkChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <Input
                    name="twitter"
                    placeholder="Enter Twitter profile URL"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialLinkChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    name="instagram"
                    placeholder="Enter Instagram profile URL"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialLinkChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}