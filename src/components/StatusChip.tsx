import React from 'react';
import './StatusChip.css';

export interface StatusChipProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  label: string;
  pulse?: boolean;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  variant = 'neutral',
  label,
  pulse = false,
  className = ''
}) => {
  const chipClass = [
    'kf-status-chip',
    `kf-status-chip-${variant}`,
    pulse ? 'kf-status-chip-pulse' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={chipClass}>
      {pulse && <span className="kf-chip-dot" />}
      <span className="kf-chip-label">{label}</span>
    </span>
  );
};
