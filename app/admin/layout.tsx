"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dummyState, setDummyState] = useState(false); // You can remove this if not needed

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
