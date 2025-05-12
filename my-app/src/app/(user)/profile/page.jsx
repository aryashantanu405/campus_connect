'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Heart,
  Calendar,
  MapPin,
  Link,
  Upload
} from 'lucide-react';

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const profileData = {
    name: isLoaded ? user?.firstName + ' ' + user?.lastName : 'Loading...',
    email: isLoaded ? user?.emailAddresses[0]?.emailAddress : 'Loading...',
    avatar: isLoaded ? user?.imageUrl : '/profile-placeholder.png',
    department: 'Electronics & Communication Engineering',
    year: '2nd Year',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    hobbies: ['Photography', 'Gaming', 'Reading'],
    bio: 'Passionate engineering student with a keen interest in technology and innovation. Always eager to learn and contribute to the community.',
    socialLinks: {
      github: 'github.com/username',
      linkedin: 'linkedin.com/in/username'
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="text-center">
              <div className="relative inline-block group">
                <Image
                  src={profileData.avatar}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full ring-4 ring-purple-100"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="flex flex-col items-center gap-4">
                        {previewImage && (
                          <Image
                            src={previewImage}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="rounded-full"
                          />
                        )}
                        <Label
                          htmlFor="picture"
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                          <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      </div>
                      <div className="flex justify-end gap-4">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                          Update Picture
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-purple-600 font-medium">{profileData.department}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all duration-300">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Full Name</Label>
                        <Input id="username" defaultValue={profileData.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={profileData.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select defaultValue="ece">
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ece">Electronics & Communication</SelectItem>
                            <SelectItem value="cse">Computer Science</SelectItem>
                            <SelectItem value="me">Mechanical</SelectItem>
                            <SelectItem value="ce">Civil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Study</Label>
                        <Select defaultValue="2">
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={profileData.location} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hobbies">Hobbies</Label>
                        <Input id="hobbies" defaultValue={profileData.hobbies.join(', ')} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          defaultValue={profileData.bio}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input id="github" defaultValue={profileData.socialLinks.github} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input id="linkedin" defaultValue={profileData.socialLinks.linkedin} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                     <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all duration-300">
                      Save Changes
                    </Button>
                  </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span>{profileData.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>{profileData.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
