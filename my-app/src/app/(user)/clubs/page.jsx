'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Heart, Share2, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function ClubPage() {
  const { user } = useUser();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClubData = async () => {
    try {
      const response = await fetch(user ? `/api/clubs?user_id=${user.id}` : '/api/clubs');
      if (!response.ok) throw new Error('Failed to fetch clubs');
      const data = await response.json();
      setClubs(data);
      setError('');
    } catch (error) {
      setError('Failed to load clubs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [user]);

  const toggleFollow = async (clubId, currentlyFollowed) => {
    if (!user) {
      setError('Please sign in to follow clubs.');
      return;
    }

    // Optimistically update UI
    setClubs(prevClubs => 
      prevClubs.map(club => 
        club.clubid === clubId 
          ? {
              ...club,
              isFollowed: !currentlyFollowed,
              followers: currentlyFollowed ? club.followers - 1 : club.followers + 1
            }
          : club
      )
    );

    try {
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          club_id: clubId,
          action: currentlyFollowed ? 'unfollow' : 'follow'
        })
      });

      if (!response.ok) throw new Error('Failed to update follow status');
      
      // Refresh data to ensure consistency
      await fetchClubData();
      setError('');
    } catch (error) {
      // Revert optimistic update on error
      setError('Failed to update follow status. Please try again.');
      await fetchClubData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Discover Amazing Clubs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join vibrant communities, connect with like-minded people, and be part of something extraordinary
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <Card
              key={club.clubid}
              className="group p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all">
                  <Image
                    src={club.clublogo}
                    alt="Club Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {club.clubname}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600 mb-2">
                        {club.clubtype}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={() => setError('Share functionality coming soon!')}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{club.followers} followers</span>
                    </div>
                    <Button
                      onClick={() => toggleFollow(club.clubid, club.isFollowed)}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        club.isFollowed
                          ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          club.isFollowed ? 'fill-purple-600' : ''
                        }`}
                      />
                      {club.isFollowed ? 'Following' : 'Follow'}
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