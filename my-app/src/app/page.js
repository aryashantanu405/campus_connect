'use client';

import { Users, BookOpen, Trophy, ArrowRight, Link } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const handlegetstarted=()=>{
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-up');
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Unify
            </span>
          </div>
          <div className="space-x-4 flex items-center">
          {isSignedIn ? (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                <Image
                  src={user?.imageUrl || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full" width={32} height={32} 
                />
                <span className="hidden md:inline font-medium">{user?.firstName}</span>
              </button>

              <SignOutButton>
                <button className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/sign-in')}
                className="px-2 py-2 text-blue-600 hover:text-purple-300 transition-colors border-blue-400"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/sign-up')}
                className="px-2 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-4xl px-4 z-10">
          <div className="inline-block mb-4 px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="text-sm font-medium text-blue-600">🎉 Join 5000+ students already connected</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
            Your Campus Life, Amplified
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Transform your college experience with a vibrant community, mentorship opportunities, 
            and exciting challenges that make every day count.
          </p>
          <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105" onClick={handlegetstarted}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 group hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200 text-center">
            <div className="bg-blue-50 rounded-full p-4 w-fit mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Community Building</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with like-minded peers, join vibrant clubs, and create lasting friendships. 
              Your college community awaits!
            </p>
          </Card>

          <Card className="p-8 group hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200 text-center">
            <div className="bg-purple-50 rounded-full p-4 w-fit mx-auto mb-6 group-hover:bg-purple-100 transition-colors">
              <BookOpen className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Senior Connect</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn from experienced seniors, access exclusive resources, and get personalized 
              guidance for success.
            </p>
          </Card>

          <Card className="p-8 group hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-amber-200 text-center">
            <div className="bg-amber-50 rounded-full p-4 w-fit mx-auto mb-6 group-hover:bg-amber-100 transition-colors">
              <Trophy className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Challenges & Events</h3>
            <p className="text-gray-600 leading-relaxed">
              Compete in exciting challenges, climb the leaderboards, and earn recognition 
              while having fun!
            </p>
          </Card>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="group">
              <p className="text-5xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform">5000+</p>
              <p className="text-gray-700 font-medium">Active Users</p>
            </div>
            <div className="group">
              <p className="text-5xl font-bold text-purple-600 mb-3 group-hover:scale-110 transition-transform">50+</p>
              <p className="text-gray-700 font-medium">Campus Clubs</p>
            </div>
            <div className="group">
              <p className="text-5xl font-bold text-amber-600 mb-3 group-hover:scale-110 transition-transform">200+</p>
              <p className="text-gray-700 font-medium">Senior Mentors</p>
            </div>
            <div className="group">
              <p className="text-5xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform">1000+</p>
              <p className="text-gray-700 font-medium">Daily Interactions</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}