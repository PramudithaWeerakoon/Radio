import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const members = await prisma.member.findMany();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newMember = await prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        profileImageUrl: data.profileImageUrl,
        bio: data.bio,
        joinDate: new Date(data.joinDate),
        facebook: data.socialLinks.facebook,
        twitter: data.socialLinks.twitter,
        instagram: data.socialLinks.instagram,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    await prisma.member.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
