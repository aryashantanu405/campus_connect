import UserModel from "@/lib/user.model";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
connectDB();

//function to fetch followed clubs on initial load
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const user = await UserModel.findOne({ clerkId: user_id });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user.clubsfollowed, { status: 200 });
  } catch (error) {
    console.error("Error fetching followed clubs:", error);
    return NextResponse.json(
      { message: "Failed to fetch followed clubs" },
      { status: 500 }
    );
  }
}