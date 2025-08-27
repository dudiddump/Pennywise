import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function PUT(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const { fullName, monthlySalary, savingsPercentage } = await request.json();

        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                fullName,
                monthlySalary,
                savingsPercentage,
            },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "Profile updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating user profile:", error);
        return Response.json(
            { success: false, message: "Error updating profile" },
            { status: 500 }
        );
    }
}
