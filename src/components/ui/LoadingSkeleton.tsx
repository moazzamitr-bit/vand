export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-white/5">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#161b27] border border-white/8 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-white/5 rounded w-24" />
          <div className="h-7 bg-white/8 rounded w-20 mt-1" />
        </div>
        <div className="w-9 h-9 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
}
