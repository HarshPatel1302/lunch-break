import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { broughtLunch, foodRequest } = await req.json();

    const lunchUpdate = await prisma.lunchUpdate.create({
      data: {
        userId: session.user.id,
        broughtLunch: Boolean(broughtLunch),
        foodRequest: foodRequest || null,
      },
      include: {
        user: {
          select: {
            name: true,
            employeeId: true,
          },
        },
      },
    });

    return NextResponse.json(lunchUpdate);
  } catch (error) {
    console.error("Error creating lunch update:", error);
    return NextResponse.json(
      { error: "Failed to create lunch update" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const isAdmin = session.user.role === "ADMIN";

    // Calculate date filter: 2 days ago for employees, no filter for admin
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    if (all) {
      // For feed page - show all messages to admin, last 2 days to employees
      const whereClause: any = {};
      
      if (!isAdmin) {
        // Employees can only see messages from last 2 days
        whereClause.createdAt = {
          gte: twoDaysAgo,
        };
        // Employees can only see "didn't bring lunch" messages
        whereClause.broughtLunch = false;
      }

      const updates = await prisma.lunchUpdate.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              name: true,
              employeeId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(updates);
    }

    // For personal dashboard - show user's own updates
    const updates = await prisma.lunchUpdate.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching lunch updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch lunch updates" },
      { status: 500 }
    );
  }
}

