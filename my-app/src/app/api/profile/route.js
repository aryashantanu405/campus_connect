import connectDB from "@/lib/connectDb";
import User from "@/lib/user.model";
import { NextResponse } from "next/server";

 connectDB();
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  try {
    const user = await Usermodel.findOne({ clerkId: user_id });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userData = await req.json();
    const user_id = userData.user_id;

    if (!user_id) {
      return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
    }

    console.log('Other user data:', userData);
     const u=await User.findOne({ clerkId: user_id });
     if(!u){
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
     }
     else{
      u.username = userData.name;
      u.department = userData.department;
      u.current_year = userData.current_year;
      u.phonenumber = userData.phonenumber;
      u.hobbies = userData.hobbies;
      u.bio = userData.bio;
      u.githubprofile = userData.githubprofile;
      u.linkedinprofile = userData.linkedinprofile;
      u.location = userData.location;
      await u.save();
      console.log('User updated in database:', u);
     }

    return NextResponse.json({ message: 'User data received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error parsing user data:', error);
    return NextResponse.json({ message: 'Failed to receive user data' }, { status: 400 });
  }
}
