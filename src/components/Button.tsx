import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClass = [
    'kf-btn',
    `kf-btn-${variant}`,
    `kf-btn-${size}`,
    fullWidth ? 'kf-btn-full' : '',
    loading ? 'kf-btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="kf-btn-spinner" aria-hidden="true" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="kf-btn-icon kf-btn-icon-left">{icon}</span>
      )}
      <span className="kf-btn-text">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="kf-btn-icon kf-btn-icon-right">{icon}</span>
      )}
    </button>
  );
};
