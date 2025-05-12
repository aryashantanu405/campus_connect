import connectDB from '@/lib/connectDb';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log("Connecting to database...");
    const client = await connectDB();

    const db = client.connection.useDb("students");
    const comments = await db.collection("clubs").find().limit(5).toArray();

    console.log("Fetched Comments:", comments);

    return NextResponse.json({ message: "Fetched comments successfully", comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
