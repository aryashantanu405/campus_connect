//routes to handle the calculation of ranks on leaderboard by retrieving the data of all users from the database 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import LeaderboardModel from '@/lib/leaderboard.model';

const initialData = [
  { name: "Alice Smith", score: 95, avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "Bob Johnson", score: 92, avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "Charlie Brown", score: 88, avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "Diana Miller", score: 85, avatar: "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "Edward Wilson", score: 82, avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150" }
];

// Connect to database
connectDB();

// Helper function to seed initial data
async function seedInitialData() {
  const count = await LeaderboardModel.countDocuments();
  if (count === 0) {
    await LeaderboardModel.insertMany(initialData);
  }
}

// GET: Fetch all users sorted by score
export async function GET() {
  try {
    await seedInitialData();
    const users = await LeaderboardModel.find()
      .sort({ score: -1 })
      .limit(10);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}

// POST: Add new user or update existing user's score
// export async function POST(req) {
//   try {
//     const userData = await req.json();
//     const { name, score, avatar } = userData;

//     const user = await LeaderboardModel.findOneAndUpdate(
//       { name },
//       { name, score, avatar },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json(user);
//   } catch (error) {
//     return NextResponse.json(
//       { message: 'Failed to update user data' },
//       { status: 400 }
//     );
//   }
// }

// PUT: Update user's score
// export async function PUT(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('id');
//     const { score } = await req.json();

//     const user = await LeaderboardModel.findByIdAndUpdate(
//       userId,
//       { score },
//       { new: true }
//     );

//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     return NextResponse.json(
//       { message: 'Failed to update score' },
//       { status: 400 }
//     );
//   }
// }

// DELETE: Remove user from leaderboard
// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('id');

//     const user = await LeaderboardModel.findByIdAndDelete(userId);

//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: 'User removed successfully' }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: 'Failed to remove user' },
//       { status: 400 }
//     );
//   }
// }