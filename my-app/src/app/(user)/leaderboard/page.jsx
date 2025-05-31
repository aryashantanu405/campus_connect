import Leaderboard from '@/components/ui/leaderboard';

export const metadata = {
  title: 'Leaderboard | Top Players',
  description: 'Check out our top performing players',
}

export default function LeaderboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Player Leaderboard</h1>
      <Leaderboard />
    </main>
  );
}