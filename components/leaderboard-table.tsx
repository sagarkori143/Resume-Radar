import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface LeaderboardEntry {
  id: string
  user_id: string
  file_name: string
  score: number
  reviewed_at: string
  user: {
    email: string
    full_name: string | null
  }
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  startRank?: number
}

export function LeaderboardTable({ entries, startRank = 1 }: LeaderboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Reviewed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry, index) => {
          const rank = startRank + index
          return (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">#{rank}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{entry.user.full_name || "Anonymous"}</div>
                  <div className="text-sm text-muted-foreground">{entry.user.email}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{entry.file_name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono font-semibold">
                  {entry.score}/100
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(entry.reviewed_at), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
