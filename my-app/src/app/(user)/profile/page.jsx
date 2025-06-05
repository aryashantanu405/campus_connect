'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Link as LinkIcon,
  Github,
  Linkedin,
  Upload,
  BookOpen,
  Trophy,
  Target,
  Coffee,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
  username: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
 
  department: z.string()
    .min(1, 'Please select a department'),
  year: z.string()
    .min(1, 'Please select a year'),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  hobbies: z.string()
    .min(2, 'Please enter at least one hobby')
    .max(200, 'Hobbies must be less than 200 characters'),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  github: z.string()
    .regex(/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/, 'Please enter a valid GitHub profile URL')
    .or(z.string().length(0)),
  linkedin: z.string()
    .regex(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/, 'Please enter a valid LinkedIn profile URL')
    .or(z.string().length(0)),
});

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userdetails, setUserDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const user_id = isLoaded ? user?.id : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
    watch
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  async function fetchUserData(user_id) {
    try {
      const response = await fetch(`/api/dashboard?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      setUserDetails(data);
      
      reset({
        username: data.name || '',
        department: data.department || '',
        year: data.current_year || '',
        location: data.location || '',
        hobbies: data.hobbies?.join(', ') || '',
        bio: data.bio || '',
        github: data.githubprofile || '',
        linkedin: data.linkedinprofile || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    }
  }

  useEffect(() => {
    if (isLoaded && user_id) {
      fetchUserData(user_id);
    }
  }, [isLoaded, user_id]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('user_id', user_id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update user profile with new image URL
      const userUpdateResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          profileImage: data.url
        }),
      });

      if (!userUpdateResponse.ok) {
        throw new Error('Failed to update profile with new image');
      }

      toast.success('Profile picture updated successfully');
      setIsImageDialogOpen(false);
      fetchUserData(user_id); // Refresh user data
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsImageUploading(false);
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          userData: {
            name: data.username,
            department: data.department,
            current_year: data.year,
            location: data.location,
            hobbies: data.hobbies.split(',').map(h => h.trim()),
            bio: data.bio,
            githubprofile: data.github,
            linkedinprofile: data.linkedin
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      setIsDialogOpen(false);
      fetchUserData(user_id);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (field, value) => {
    setValue(field, value);
    trigger(field);
  };

  const profileData = {
    name: isLoaded ? user?.firstName + ' ' + user?.lastName : 'Loading...',
    email: isLoaded ? user?.emailAddresses[0]?.emailAddress : 'Loading...',
    avatar: userdetails?.image.url || (isLoaded ? user?.imageUrl : '/profile-placeholder.png'),
    dept: userdetails?.department || 'Electronics & Communication',
    year: userdetails?.current_year || '2nd Year',
    location: userdetails?.location || 'Patna, India',
    hobbies: userdetails?.hobbies || ['Photography', 'Gaming', 'Reading'],
    bio: userdetails?.bio || 'Passionate engineering student with a keen interest in technology and innovation.',
    socialLinks: {
      github: userdetails?.githubprofile || 'github.com/username',
      linkedin: userdetails?.linkedinprofile || 'linkedin.com/in/username'
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Background animation */}
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
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
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
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsImageDialogOpen(false);
                            setPreviewImage(null);
                            setSelectedImage(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                          onClick={handleImageUpload}
                          disabled={!selectedImage || isImageUploading}
                        >
                          {isImageUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Update Picture'
                          )}
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
                  <p className="text-purple-600 font-medium">{profileData.dept}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all duration-300">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex-1 overflow-y-auto px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="username">
                              Full Name
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="username"
                              {...register('username')}
                              className={errors.username ? 'border-red-500' : ''}
                            />
                            {errors.username && (
                              <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="department">
                              Department
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange('department', value)}
                            >
                              <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="Mechanical">Mechanical</SelectItem>
                                <SelectItem value="Civil">Civil</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.department && (
                              <p className="text-sm text-red-500">{errors.department.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="year">
                              Year of Study
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) => handleSelectChange('year', value)}
                            >
                              <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.year && (
                              <p className="text-sm text-red-500">{errors.year.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">
                              Location
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="location"
                              {...register('location')}
                              className={errors.location ? 'border-red-500' : ''}
                            />
                            {errors.location && (
                              <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hobbies">
                              Hobbies (comma-separated)
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="hobbies"
                              {...register('hobbies')}
                              className={errors.hobbies ? 'border-red-500' : ''}
                            />
                            {errors.hobbies && (
                              <p className="text-sm text-red-500">{errors.hobbies.message}</p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">
                              Bio
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="bio"
                              {...register('bio')}
                              className={`min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
                            />
                            {errors.bio && (
                              <p className="text-sm text-red-500">{errors.bio.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub Profile</Label>
                            <Input
                              id="github"
                              {...register('github')}
                              className={errors.github ? 'border-red-500' : ''}
                            />
                            {errors.github && (
                              <p className="text-sm text-red-500">{errors.github.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn Profile</Label>
                            <Input
                              id="linkedin"
                              {...register('linkedin')}
                              className={errors.linkedin ? 'border-red-500' : ''}
                            />
                            {errors.linkedin && (
                              <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 py-4 border-t bg-white mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span>{profileData.dept}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>{profileData.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-500" />
                  <span>{profileData.hobbies.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">About Me</h3>
                <p className="text-gray-600">{profileData.bio}</p>
              </div>

              <div className="flex gap-4 mt-6">
                <a
                  href={`https://${profileData.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={`https://${profileData.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}