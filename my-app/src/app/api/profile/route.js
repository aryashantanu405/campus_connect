import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import User from '@/lib/user.model';

connectDB();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  try {
    const user = await User.findOne({ clerkId: user_id });
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
    const data = await req.json();
    const { user_id, userData } = data;

    if (!user_id) {
      return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
    }

    const user = await User.findOne({ clerkId: user_id });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user fields
    if (userData) {
      Object.assign(user, {
        username: userData.name,
        department: userData.department,
        current_year: userData.current_year,
        location: userData.location,
        hobbies: userData.hobbies,
        bio: userData.bio,
        githubprofile: userData.githubprofile,
        linkedinprofile: userData.linkedinprofile
      });
    }

    // Handle profile image update separately
    if (data.profileImage) {
      user.image = {
        url: data.profileImage,
        public_id: null
      };
    }

    await user.save();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: user.toObject()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}