import { ReactNode } from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="card p-12 flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20 flex items-center justify-center mb-5">
        <Icon className="text-brand-400" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-white/50 max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
