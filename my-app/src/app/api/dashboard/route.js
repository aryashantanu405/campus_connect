import connectDB from '@/lib/connectDb';
import { NextResponse } from 'next/server';
import Usermodel from '@/lib/user.model';


connectDB();

//route to handle new user data;
export async function POST(req) {
  try {
    const userData = await req.json(); // parse the incoming JSON
    console.log('new User received at backend:'); // log full user object

    const {id,firstName} = userData;
    const email=userData.primaryEmailAddress.emailAddress; // destructure the user data
       const existinguser=await Usermodel.findOne({ clerkId: id });
    if (existinguser) {
      console.log('User already exists in the database:', existinguser); // log the existing user object
      return NextResponse.json({ message: 'User already exists' }, { status: 200 });
    }
    else{
const u=new Usermodel({
      clerkId:id,
      username: firstName,
      email: email,
      department:"ECE",
      current_year: 1,
      points: 0,
    });
    await u.save();
    console.log('new User saved to database:'); // log the saved user object
    }
    return NextResponse.json({ message: 'User received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error parsing user data:', error);
    return NextResponse.json({ message: 'Failed to receive user' }, { status: 400 });
  }
}

//route to fetch existing user data;
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

