'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"

export default function UserFlexCard() {
  const { user } = useUser()

  if (!user) return null

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader className="flex items-center flex-col space-y-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
          <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user.username || user.fullName}</CardTitle>
        <CardDescription className="italic">"Spreading Ghibli vibes 🌸"</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-2 pt-2">
        <Badge variant="secondary">🏆 Top Helper</Badge>
        <Badge variant="secondary">💡 Innovator</Badge>
        <Badge variant="secondary">🎯 Club Lead</Badge>
      </CardContent>
    </Card>
  )
}
