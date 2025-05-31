'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import FlexCard from '@/components/FlexCard';
import { 
  Users, 
  Award, 
  Calendar, 
  MessageSquare, 
  Users2, 
  Trophy, 
  Search, 
  HelpCircle,
  Share2
} from 'lucide-react';

export default function Dashboard() {
  const [userdetails, setUserDetails] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const user_id = isLoaded ? user?.id : null;

  const user_name = isLoaded ? user?.firstName || 'User' : 'Loading...';
  const profileImage = isLoaded ? user?.imageUrl || '/profile-placeholder.png' : '/profile-placeholder.png';

  const quickLinks = [
    { name: 'My Clubs', link: '/clubs', icon: Users2, color: 'from-blue-500 to-blue-700' },
    { name: 'Leaderboard', link: '/leaderboard', icon: Trophy, color: 'from-purple-500 to-purple-700' },
    { name: 'Challenges', link: '/challenges', icon: Award, color: 'from-green-500 to-green-700' },
    { name: 'Senior Corner', link: '/seniors', icon: Users, color: 'from-amber-500 to-amber-700' },
    { name: 'Lost & Found', link: '/lost-found', icon: Search, color: 'from-red-500 to-red-700' },
    { name: 'Community', link: '/community', icon: HelpCircle, color: 'from-indigo-500 to-indigo-700' }
  ];

  async function handlenewuser(user) {
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error sending user:', error);
    }
  }

  async function fetchUserData(user_id) {
    try {
      const response = await fetch(`/api/dashboard?user_id=${user_id}`);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }
      const data = await response.json();
      console.log('User data:', data);
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      handlenewuser(user);
      fetchUserData(user_id);
    }
  }, [isLoaded, user, user_id]);

  const u_name = userdetails?.username || 'Loading...';
  const department = userdetails?.department || 'Loading...';
  const current_year = userdetails?.current_year || 'Loading...';
  const points = userdetails?.points || 0;
  const numberofclubsjoined = userdetails?.numberofclubsjoined || 0;

  const stats = [
    { label: 'Clubs Joined', value: numberofclubsjoined, icon: Users, color: 'text-blue-600' },
    { label: 'XP Points', value: points, icon: Award, color: 'text-purple-600' },
    { label: 'Events Attended', value: 12, icon: Calendar, color: 'text-green-600' },
    { label: 'Memes Uploaded', value: 9, icon: MessageSquare, color: 'text-amber-600' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Animated background circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <section className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome back, {u_name || user_name} 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening in your UNIFY space today.</p>
        </section>

        {/* Profile Summary */}
        <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={profileImage}
              alt="Profile"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100"
              onError={(e) => e.target.src = '/profile-placeholder.png'}
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{u_name || user_name}</h2>
              <p className="text-purple-600 font-medium">{department} | {current_year}</p>
            </div>
            <div className="sm:ml-auto">
              <Link
                href="/profile"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card
              key={label}
              className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 group hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Navigate Quickly</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map(({ name, link, icon: Icon, color }) => (
              <Link key={name} href={link}>
                <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {name}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Flex Card Section */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 cursor-pointer">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Your Flex Card</h2>
                    <p className="text-gray-600">Share your achievements with the community!</p>
                  </div>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View & Share
                </button>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle className="text-2xl font-bold mb-6 text-center">
              Your Achievement Card
            </DialogTitle>
            <FlexCard
              user={{
                username: u_name,
                department,
                current_year,
                points
              }}
              profileImage={profileImage}
              stats={stats}
            />
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-500">
            🚀 Made with ❤️ by Shantanu
          </p>
        </footer>
      </div>
    </main>
  );
}