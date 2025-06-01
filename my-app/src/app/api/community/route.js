import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import PostModel from '@/lib/post.model';

connectDB();

// Initial seed data
const seedData = [
  {
    title: 'Campus Hackathon Success! 🚀',
    description: 'Just wrapped up our biggest hackathon yet! Over 200 participants, 48 hours of coding, and some incredible projects. Proud to see such innovation from our student community. #CampusHackathon #Innovation #StudentLife',
    image_src: 'https://images.pexels.com/photos/7433833/pexels-photo-7433833.jpeg',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      userId: 'seed_user_1'
    },
    likes: 42,
    likedBy: []
  },
  {
    title: 'Cultural Night Highlights ✨',
    description: 'What an amazing display of talent at last night\'s cultural fest! From classical dance to modern music, our students showed their artistic side. Check out some moments from the event. #CulturalNight #CampusLife #Diversity',
    image_src: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      userId: 'seed_user_2'
    },
    likes: 89,
    likedBy: []
  },
  {
    title: 'New Library Resources 📚',
    description: 'The college library just got updated with a new digital section! Now you can access thousands of e-books and research papers. Don\'t forget to check out the new study spaces too. #DigitalLibrary #Education #StudentResources',
    image_src: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
    author: {
      name: 'Emily Zhang',
      avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg',
      userId: 'seed_user_3'
    },
    likes: 31,
    likedBy: []
  }
];




// Get all posts
export async function GET(request) {
  try { 
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    const posts = await PostModel.find().sort({ createdAt: -1 });
    
    if (userId) {
      // If user_id is provided, enhance posts with liked status
      const enhancedPosts = posts.map(post => ({
        ...post.toObject(),
        isLiked: post.likedBy.includes(userId)
      }));
      return NextResponse.json(enhancedPosts);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Create new post
export async function POST(request) {
  try {
    const body = await request.json();
    const newPost = await PostModel.create(body);
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}

// Update post (like/unlike)
export async function PUT(request) {
  try {
    const { post_id, user_id, action } = await request.json();
    const post = await PostModel.findById(post_id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (action === 'like') {
      if (!post.likedBy.includes(user_id)) {
        post.likes += 1;
        post.likedBy.push(user_id);
      }
    } else if (action === 'unlike') {
      if (post.likedBy.includes(user_id)) {
        post.likes = Math.max(0, post.likes - 1);
        post.likedBy = post.likedBy.filter(id => id !== user_id);
      }
    }

    await post.save();

    return NextResponse.json({
      likes: post.likes,
      isLiked: post.likedBy.includes(user_id)
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

// Delete post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    const userId = searchParams.get('user_id');

    const post = await PostModel.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Only allow deletion if the user is the author
    if (post.author.userId !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await PostModel.findByIdAndDelete(postId);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}