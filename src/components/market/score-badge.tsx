export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{score}/100</span>;
}


