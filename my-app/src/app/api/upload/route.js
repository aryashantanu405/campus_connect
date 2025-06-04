import { NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import User from '@/lib/user.model';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const user_id = formData.get('user_id');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId: user_id });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old image if exists
    if (user.image?.public_id) {
      await deleteImage(user.image.public_id);
    }

    const result = await uploadImage(file);
    
    // Update user with new image
    user.image = {
      url: result.url,
      public_id: result.public_id
    };
    await user.save();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}