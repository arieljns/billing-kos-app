import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'surface' | 'elevated';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'surface',
  interactive = false,
  padding = 'md',
  radius = 'lg',
  header,
  footer,
  className = '',
  ...props
}) => {
  const cardClass = [
    'kf-card',
    `kf-card-el-${elevation}`,
    `kf-card-pad-${padding}`,
    `kf-card-rad-${radius}`,
    interactive ? 'kf-card-interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} {...props}>
      {header && (
        <div className="kf-card-header">
          {header}
        </div>
      )}
      <div className="kf-card-body">
        {children}
      </div>
      {footer && (
        <div className="kf-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};
