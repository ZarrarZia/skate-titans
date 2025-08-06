import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

const topPlayers = [
  { rank: 1, name: 'AceRunner', score: 10520300, avatar: 'https://placehold.co/40x40/be29ec/ffffff.png', hint: 'gamer avatar male' },
  { rank: 2, name: 'GraffitiQueen', score: 9870100, avatar: 'https://placehold.co/40x40/2996ec/ffffff.png', hint: 'gamer avatar female' },
  { rank: 3, name: 'SubwaySurferX', score: 9500500, avatar: 'https://placehold.co/40x40/34d399/ffffff.png', hint: 'avatar robot' },
  { rank: 4, name: 'DashMaster', score: 8900200, avatar: 'https://placehold.co/40x40/f59e0b/ffffff.png', hint: 'avatar ninja' },
  { rank: 5, name: 'CoinCollector', score: 8750800, avatar: 'https://placehold.co/40x40/ec4899/ffffff.png', hint: 'avatar alien' },
  { rank: 6, name: 'RailGrinder', score: 8600000, avatar: 'https://placehold.co/40x40/ef4444/ffffff.png', hint: 'avatar punk' },
  { rank: 7, name: 'JetpackJoy', score: 8450120, avatar: 'https://placehold.co/40x40/6b7280/ffffff.png', hint: 'avatar sunglasses' },
  { rank: 8, name: 'TitanSkater', score: 8200340, avatar: 'https://placehold.co/40x40/1f2937/ffffff.png', hint: 'avatar helmet' },
  { rank: 9, name: 'FreshBeats', score: 8100990, avatar: 'https://placehold.co/40x40/8b5cf6/ffffff.png', hint: 'avatar headphones' },
  { rank: 10, name: 'SpeedDemon', score: 7990000, avatar: 'https://placehold.co/40x40/d946ef/ffffff.png', hint: 'avatar fire' },
];

function getRankColor(rank: number) {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-yellow-600';
  return 'text-foreground';
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-shadow md:text-6xl">Global Leaderboard</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Think you have what it takes? Check out the top players and see where you stand.
        </p>
      </div>

      <Card className="mt-12 w-full max-w-4xl mx-auto border-primary/20 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-3xl">
            <Trophy className="h-8 w-8 text-primary" /> Top 100 Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center text-base">Rank</TableHead>
                <TableHead className="text-base">Player</TableHead>
                <TableHead className="text-right text-base">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlayers.map((player) => (
                <TableRow key={player.rank} className="text-lg">
                  <TableCell className={`text-center font-bold text-xl ${getRankColor(player.rank)}`}>
                    {player.rank <= 3 ? <Trophy className="inline-block h-6 w-6" /> : player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.hint} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{player.score.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
