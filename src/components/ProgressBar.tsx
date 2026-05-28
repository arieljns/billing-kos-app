import React from 'react';
import './ProgressBar.css';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'success',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const containerClass = [
    'kf-progress-container',
    `kf-progress-size-${size}`,
    className
  ].filter(Boolean).join(' ');

  const barClass = [
    'kf-progress-bar-fill',
    `kf-progress-bar-fill-${variant}`
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {(label || showValue) && (
        <div className="kf-progress-info">
          {label && <span className="kf-progress-label">{label}</span>}
          {showValue && (
            <span className="kf-progress-value-text">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className="kf-progress-track">
        <div 
          className={barClass} 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};
