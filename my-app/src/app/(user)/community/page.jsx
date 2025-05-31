'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { MessageSquare, Heart, Plus, Upload } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for initial posts
const initialPosts = [
  {
    id: 1,
    title: 'Campus Hackathon Success!',
    description: 'Just wrapped up our biggest hackathon yet! Over 200 participants, 48 hours of coding, and some incredible projects. Proud to see such innovation from our student community.',
    image_src: 'https://images.pexels.com/photos/7433833/pexels-photo-7433833.jpeg',
    date: '2024-03-20T10:00:00Z',
    likes: 42,
    comments: 15
  },
  {
    id: 2,
    title: 'Cultural Night Highlights',
    description: 'What an amazing display of talent at last night\'s cultural fest! From classical dance to modern music, our students showed their artistic side. Check out some moments from the event.',
    image_src: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
    date: '2024-03-19T18:30:00Z',
    likes: 89,
    comments: 23
  },
  {
    id: 3,
    title: 'New Library Resources',
    description: 'The college library just got updated with a new digital section! Now you can access thousands of e-books and research papers. Don\'t forget to check out the new study spaces too.',
    image_src: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
    date: '2024-03-18T09:15:00Z',
    likes: 31,
    comments: 8
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_src: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId
          ? { ...post, likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image_src: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: posts.length + 1,
      ...formData,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setIsDialogOpen(false);
    setFormData({ title: '', description: '', image_src: '' });
    setPreviewImage(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Animated background circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Community Feed
          </h1>
          <p className="text-gray-600 text-lg">
            Share and connect with your college community
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
            >
              {post.image_src && (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={post.image_src}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{format(new Date(post.date), 'PPP')}</span>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedPosts.has(post.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-500'
                      }`}
                    />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Share more details..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {previewImage ? (
                      <div className="relative w-40 h-40 mx-auto mb-4">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-300" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}