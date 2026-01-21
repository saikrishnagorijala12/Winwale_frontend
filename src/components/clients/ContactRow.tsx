import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactRowProps {
  icon: LucideIcon;
  value: string | null;
}

export const ContactRow: React.FC<ContactRowProps> = ({ icon: Icon, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm">{value}</span>
    </div>
  );
};