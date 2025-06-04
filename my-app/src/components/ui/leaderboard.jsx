"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const LeaderboardSkeleton = () => {
  return (
    <div>
      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RankIcon = ({ position }) => {
  if (position === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" />;
  } else if (position === 2) {
    return <Medal className="h-5 w-5 text-gray-400" />;
  } else if (position === 3) {
    return <Award className="h-5 w-5 text-amber-700" />;
  }
  return <span className="font-medium text-muted-foreground">{position}</span>;
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setUsers(data.sort((a, b) => b.score - a.score));
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>Our top 10 players ranked by score.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={user._id} 
                className={cn(
                  "transition-colors hover:bg-muted/50",
                  index < 3 ? "font-medium" : ""
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex justify-center items-center w-6 h-6">
                    <RankIcon position={index + 1} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {users.map((user, index) => (
          <Card 
            key={user._id} 
            className={cn(
              "transition-all hover:shadow-md",
              index < 3 ? "border-l-4 font-medium" : "",
              index === 0 ? "border-yellow-500" : "",
              index === 1 ? "border-gray-400" : "",
              index === 2 ? "border-amber-700" : ""
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center w-6 h-6">
                    <RankIcon position={index + 1} />
                  </div>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={index < 3 ? "font-medium" : ""}>{user.name}</p>
                  </div>
                </div>
                <div className="font-semibold">{user.score}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}