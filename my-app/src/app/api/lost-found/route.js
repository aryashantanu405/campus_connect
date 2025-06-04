import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import ItemModel from '@/lib/items.model';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

const sampleItems = [
  {
    user_id: "user123",
    owner_username: "john_doe",
    place: "Central Library, 2nd Floor",
    description: "Black wireless headphones in a blue case",
    date: new Date("2023-05-15"),
    image: {
      url: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg",
      public_id: null
    },
    type: "lost",
    status: "active",
    createdAt: new Date("2023-05-15T10:00:00Z"),
    updatedAt: new Date("2023-05-15T10:00:00Z")
  },
  // ... (keep the rest of your sample items as they are)
];

connectDB();

const seedDatabase = async () => {
  try {
    const count = await ItemModel.countDocuments();
    if (count === 0) {
      await ItemModel.insertMany(sampleItems);
      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();

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
    const formData = await request.formData();
    const description = formData.get('description');
    const place = formData.get('place');
    const type = formData.get('type');
    const date = formData.get('date');
    const user_id = formData.get('user_id');
    const owner_username = formData.get('owner_username');
    const file = formData.get('image');

    // Validate required fields
    if (!description || !place || !type || !user_id || !owner_username) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!['lost', 'found'].includes(type)) {
      return NextResponse.json({ message: 'Invalid type value' }, { status: 400 });
    }

    // Default image object
    let image = {
      url: "https://images.pexels.com/photos/1010496/pexels-photo-1010496.jpeg",
      public_id: null
    };

    // Handle file upload if exists
    if (file && file.size > 0) {
      const result = await uploadImage(file);
      image = {
        url: result.url,
        public_id: result.public_id
      };
    }

    // Create new item
    const newItem = await ItemModel.create({
      description,
      place,
      type,
      date: date ? new Date(date) : new Date(),
      user_id,
      owner_username,
      image,
      status: 'active'
    });

    return NextResponse.json({ message: 'Item posted successfully', item: newItem });
  } catch (error) {
    console.error('Error posting item:', error);
    return NextResponse.json(
      { message: 'Failed to post item', error: error.message },
      { status: 500 }
    );
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const item = await ItemModel.findById(id);
    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (item.image?.public_id) {
      await deleteImage(item.image.public_id);
    }

    await ItemModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
  }
}