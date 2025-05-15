// routes to handle the posting of lost and found items
// routes to verify the items being posted and returned

import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import ItemModel from '@/lib/items.model';

connectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = await ItemModel.create(body); // no need to call save() again

    return NextResponse.json({ message: 'Item received at backend', item: newItem }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error in posting item', error: error.message }, { status: 500 });
  }
}
