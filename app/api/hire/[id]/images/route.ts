import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const routeParams = await params;
    const id = parseInt(routeParams.id);


    if (isNaN(id)) {
      return NextResponse.json(
          { success: false, message: "Invalid ID" },
          { status: 400 }
      );
    }

    // Fetch the hire record with its images
    const hire = await prisma.hire.findUnique({
      where: { id },
      select: {
        imageName: true,
        imageData: true
      }
    });

    if (!hire) {
      return NextResponse.json(
          { success: false, message: "Hire record not found" },
          { status: 404 }
      );
    }

    // Convert binary image data to Base64 strings for client-side display
    const images = hire.imageData.map(data => {
      if (!data) return '';
      // Convert Buffer to Base64 string with proper MIME type prefix
      // Assuming most uploads are images like JPEG or PNG
      const base64 = Buffer.from(data).toString('base64');
      // We'll use a generic image MIME type here, but in a real app
      // you should store and use the actual MIME type for each image
      return `data:image/jpeg;base64,${base64}`;
    });

    return NextResponse.json({
      success: true,
      imageNames: hire.imageName,
      images
    });

  } catch (error: any) {
    console.error("Error fetching hire images:", error);
    return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch images",
          error: error.message
        },
        { status: 500 }
    );
  }
}