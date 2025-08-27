import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Income from "@/model/Income";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const income = await Income.findOne({ userId: session.user.email });

    if (!income) {
      return NextResponse.json(
        { error: "Income data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      monthlySalary: income.monthlySalary,
      currentSavings: income.currentSavings,
      savingsGoal: income.savingsGoal,
    });
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
