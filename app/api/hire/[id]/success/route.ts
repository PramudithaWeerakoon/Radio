import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

        const body = await request.json();

        const updatedHire = await prisma.hire.update({
            where: { id },
            data: { status: "confirmed", payment: true }
        });

        return NextResponse.json({
            success: true,
            hire: updatedHire
        });

    } catch (error: any) {
        console.error("Error updating hire:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update hire",
                error: error.message
            },
            { status: 500 }
        );
    }
}