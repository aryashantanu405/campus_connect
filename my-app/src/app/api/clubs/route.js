// src/app/api/clubs/route.js
import connectDB from '@/lib/connectDb';
import Clubmodel from '@/lib/club.model';
import UserModel from '@/lib/user.model';
connectDB();
import { NextResponse } from 'next/server';

//function to fetch club details from the database
export async function GET(){
    try {
        const clubs = await Clubmodel.find();
        return NextResponse.json(clubs, { status: 200 });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        return NextResponse.json({ message: 'Failed to fetch clubs' }, { status: 500 });
    }
}

//function to handle club follow and unfollow

export async function POST(request) {
  try{
    const { user_id, followed_clubs } = await request.json();
    const u=await UserModel.findOne({ clerkId: user_id });
    if (!u) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
        const followedClubs = new Set(u.clubsfollowed);
        followed_clubs.forEach((clubId) => {
            if (followedClubs.has(clubId)) {
            followedClubs.delete(clubId); // Unfollow
            } else {
            followedClubs.add(clubId); // Follow
            }
        });
        u.clubsfollowed = Array.from(followedClubs);
        u.numberofclubsjoined = followedClubs.size;
        await u.save();
    return NextResponse.json(u.clubsfollowed,{ message: 'Clubs followed successfully' }, { status: 200 });
  }
  catch (error) {
    console.error('Error following clubs:', error);
    return NextResponse.json({ message: 'Failed to follow clubs' }, { status: 500 });
  }
}

//function to handle the 



