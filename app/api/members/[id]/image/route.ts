import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        imageData: true,
        imageMimeType: true,
      },
    });

    if (!member || !member.imageData) {
      // Return a default image when no image is found
      return NextResponse.redirect(new URL('/images/default-profile.jpg', request.url));
    }

    // Return the image with proper content type
    return new NextResponse(member.imageData, {
      headers: {
        "Content-Type": member.imageMimeType || "image/jpeg",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("Error fetching member image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
