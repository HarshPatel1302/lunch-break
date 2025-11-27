import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, passcode } = await req.json();

    if (!name || !passcode) {
      return NextResponse.json(
        { error: "Missing required fields (name and passcode)" },
        { status: 400 }
      );
    }

    // Get the highest employee ID and generate next one
    const lastEmployee = await prisma.user.findFirst({
      where: {
        role: "EMPLOYEE",
        employeeId: {
          not: {
            startsWith: "ADMIN",
          },
        },
      },
      orderBy: {
        employeeId: "desc",
      },
    });

    let nextEmployeeId = "01";
    if (lastEmployee && lastEmployee.employeeId.match(/^\d{2}$/)) {
      const lastId = parseInt(lastEmployee.employeeId, 10);
      const nextId = lastId + 1;
      nextEmployeeId = nextId.toString().padStart(2, "0");
    }

    const hashedPasscode = await bcrypt.hash(passcode, 10);

    const user = await prisma.user.create({
      data: {
        name,
        employeeId: nextEmployeeId,
        passcode: hashedPasscode,
        role: "EMPLOYEE",
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      employeeId: user.employeeId,
      role: user.role,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Employee ID already exists" },
        { status: 400 }
      );
    }
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
      },
      select: {
        id: true,
        name: true,
        employeeId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

