import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import ItemModel from '@/lib/items.model';

connectDB();

export async function GET() {
  try {
    const items = await ItemModel.find().sort({ date: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ message: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = await ItemModel.create(body);
    return NextResponse.json({ message: 'Item posted successfully', item: newItem });
  } catch (error) {
    console.error('Error posting item:', error);
    return NextResponse.json({ message: 'Failed to post item' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, claimed_by } = await request.json();
    const updatedItem = await ItemModel.findByIdAndUpdate(
      id,
      { 
        claimed_by,
        status: 'claimed',
        claimed_date: new Date()
      },
      { new: true }
    );
    return NextResponse.json({ message: 'Item claimed successfully', item: updatedItem });
  } catch (error) {
    console.error('Error claiming item:', error);
    return NextResponse.json({ message: 'Failed to claim item' }, { status: 500 });
  }
}