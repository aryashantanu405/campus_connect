'use client';

import React, { useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, Download, Share2, Star, Award, Sparkles, Flame, Zap } from 'lucide-react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

export default function FlexCard({ user, profileImage, stats }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 1.0,
          pixelRatio: 3,
          skipAutoScale: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });
        
        // Convert data URL to Blob
        const blob = await fetch(dataUrl).then(res => res.blob());
        saveAs(blob, `${user.username}-flex-card.png`);
      } catch (error) {
        console.error('Error generating card:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div ref={cardRef} id="flex-card" className="w-full max-w-[400px] aspect-[4/5] transform-gpu">
        <Card className="relative p-4 sm:p-6 bg-[#0F172A] text-white overflow-hidden h-full">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-gradient"></div>
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] backdrop-saturate-150"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Centered Header with holographic effect */}
            <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-white/50">
                  <Image
                    src={profileImage}
                    alt={user.username}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {user.username}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm text-purple-300">{user.department}</span>
                  <span className="text-purple-300">•</span>
                  <span className="text-sm text-purple-300">{user.current_year}</span>
                </div>
              </div>
            </div>

            {/* Stats with neon glow */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-purple-200">XP Points</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  {user.points}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-purple-200">Achievements</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  {stats[0].value}
                </p>
              </div>
            </div>

            {/* Achievement badges */}
            <div className="flex justify-center gap-3 mb-4">
              {[
                { icon: Trophy, color: 'text-yellow-400' },
                { icon: Star, color: 'text-blue-400' },
                { icon: Zap, color: 'text-purple-400' }
              ].map((Badge, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75"></div>
                  <div className="relative p-2 bg-black/50 rounded-full backdrop-blur-sm">
                    <Badge.icon className={`w-4 h-4 ${Badge.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bio with cyberpunk style */}
            <div className="relative mb-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-sm italic text-purple-200 text-center">
                "Turning coffee into code and dreams into reality 🚀"
              </p>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>

            {/* Footer with tech pattern */}
            <div className="mt-auto flex items-center justify-center text-xs text-purple-300 border-t border-white/10 pt-3">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                @unify
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full max-w-[400px] justify-center">
        <button
          onClick={downloadCard}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
        >
          <Download className="w-4 h-4" />
          Download Card
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Unify Flex Card',
                text: `Check out my achievements on Unify! ${user.points} XP Points and counting! 🚀`,
                url: window.location.href
              });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}