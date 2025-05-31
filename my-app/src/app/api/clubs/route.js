import connectDB from '@/lib/connectDb';
import Clubmodel from '@/lib/club.model';
import UserModel from '@/lib/user.model';
import { NextResponse } from 'next/server';

connectDB();
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  try {
    // Fixed: Changed 'name' to 'clubname' to match schema
    const clubs = await Clubmodel.find().select('clubid clubname clubtype description followers clublogo');
    
    if (user_id) {
      const user = await UserModel.findOne({ clerkId: user_id });
      const clubsfollowed = user ? user.clubsfollowed : [];
      
      const enhancedClubs = clubs.map(club => ({
        ...club.toObject(),
        isFollowed: clubsfollowed.includes(club.clubid)
      }));
      
      return NextResponse.json(enhancedClubs, { status: 200 });
    }

    return NextResponse.json(clubs, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  }
}

// Existing POST endpoint (unchanged)
export async function POST(request) {
  try {
    const { user_id, club_id, action } = await request.json();
    const user = await UserModel.findOne({ clerkId: user_id });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const club = await Clubmodel.findOne({ clubid: club_id });
    if (!club) {
      return NextResponse.json({ message: 'Club not found' }, { status: 404 });
    }

    if (action === 'follow') {
      if (!user.clubsfollowed.includes(club_id)) {
        user.clubsfollowed.push(club_id);
        club.followers += 1;
      }
    } else if (action === 'unfollow') {
      user.clubsfollowed = user.clubsfollowed.filter(id => id !== club_id);
      club.followers = Math.max(0, club.followers - 1);
    }

    user.numberofclubsjoined = user.clubsfollowed.length;
    
    await Promise.all([user.save(), club.save()]);

    return NextResponse.json({ 
      isFollowed: action === 'follow',
      followers: club.followers,
      message: `Club ${action}ed successfully` 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating follow status:', error);
    return NextResponse.json({ message: 'Failed to update follow status' }, { status: 500 });
  }
}

// NEW SEEDING FUNCTION (added at bottom)


// Optional: Add this if you want a dedicated API endpoint for seeding
// export async function GET() {
//   const result = await seedClubs();
//   return NextResponse.json(result);
// }