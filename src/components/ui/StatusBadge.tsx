interface Props {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: 'Pending Review', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  approved: { label: 'Approved', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  rejected: { label: 'Rejected', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pending: { label: 'Pending', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  successful: { label: 'Successful', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  canceled: { label: 'Canceled', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  failed: { label: 'Failed', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  draft: { label: 'Draft', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  active: { label: 'Active', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  judging: { label: 'Judging', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  archived: { label: 'Archived', className: 'bg-slate-600/20 text-slate-500 border-slate-600/30' },
  published: { label: 'Published', className: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  unpublished: { label: 'Unpublished', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  membership: { label: 'Membership', className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  award: { label: 'Award', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  admin: { label: 'Admin', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  finance: { label: 'Finance', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  competition_manager: { label: 'Comp. Manager', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  viewer: { label: 'Viewer', className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  member: { label: 'Member', className: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
};

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = statusConfig[status] ?? { label: status, className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded border font-medium ${sizeClass} ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
