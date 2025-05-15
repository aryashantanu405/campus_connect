'use client';

import { useState,useEffect } from 'react';
import Image from 'next/image';
import { Users, Heart, Share2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";
import { set } from 'mongoose';


export default function ClubPage() {
  const { user} = useUser();
  const user_id = user?.id;
  const [followedClubs, setFollowedClubs] = useState(new Set());
   const [clubs, setClubs] = useState([]);
   
   const fetchclubdata =async()=>{
    try{
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setClubs(data);
    }
    catch (error) {
      console.error('Error fetching club data:', error);
    }
   };
   const handleFollow=async ()=>{
    try{
      const response =await fetch('/api/clubs',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          user_id:user_id,
          followed_clubs:Array.from(followedClubs),
        }),
      });
      console.log('Followed clubs:',Array.from(followedClubs));
      const result = await response.json();
      if (Array.isArray(result.followed_clubs)) {
        setFollowedClubs(new Set(result.followed_clubs));
      }
      console.log('Followed clubs:',followedClubs);
    }
    catch(error){
      console.error('Error following clubs:',error);
    }
   };

  const getfollowedclubs = async () => {
  try {
    const response = await fetch(`/api/clubs/follow?user_id=${user_id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok', response);
    }
    const data = await response.json();
    const updatedSet = new Set(data);
    setFollowedClubs(updatedSet);
    console.log('Followed clubs:', updatedSet);
  } catch (error) {
    console.error('Error fetching followed clubs:', error);
  }
};



    useEffect(() => {
      handleFollow();
    },[followedClubs]);

   useEffect(()=>{
    fetchclubdata();
    getfollowedclubs();
   },[user_id]);

    
  const toggleFollow = (clubId) => {
    setFollowedClubs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clubId)) {
        newSet.delete(clubId);
      } else {
        newSet.add(clubId);
      }
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Animated background circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Explore Clubs
          </h1>
          <p className="text-gray-600 text-lg">
            Join vibrant communities and be part of something amazing
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {clubs.map((club) => (
            <Card
              key={club.clubid}
              className="group p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all">
                  <Image
                    src="https://images.pexels.com/photos/7095739/pexels-photo-7095739.jpeg"

                    alt={club.clubname}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {club.name}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600 mb-2">
                        {club.category}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {club.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{club.followers} followers</span>
                    </div>
                    <Button
                      onClick={() => toggleFollow(club.clubid)}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        followedClubs.has(club.clubid)
                          ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          followedClubs.has(club.clubid) ? 'fill-purple-600' : ''
                        }`}
                      />
                      {followedClubs.has(club.clubid) ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
