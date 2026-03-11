import React from 'react';
import { LucideIcon, Phone } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/phoneUtils';

interface ContactRowProps {
  icon: LucideIcon;
  value: string | null;
}

export const ContactRow: React.FC<ContactRowProps> = ({ icon: Icon, value }) => {
  if (!value) return null;

  const displayValue = Icon === Phone ? formatPhoneNumber(value) : value;

  return (
    <div className="flex items-center gap-3 text-slate-600">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm">{displayValue}</span>
    </div>
  );
};