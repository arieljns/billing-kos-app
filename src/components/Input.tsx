import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  id,
  className = '',
  disabled,
  required,
  ...props
}) => {
  const containerClass = [
    'kf-input-container',
    error ? 'kf-input-has-error' : '',
    disabled ? 'kf-input-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const inputWrapperClass = [
    'kf-input-wrapper',
    icon ? `kf-input-with-icon-${iconPosition}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={id} className="kf-input-label">
          {label}
          {required && <span className="kf-input-required-star"> *</span>}
        </label>
      )}
      
      <div className={inputWrapperClass}>
        {icon && iconPosition === 'left' && (
          <div className="kf-input-icon kf-input-icon-left">{icon}</div>
        )}
        
        <input
          id={id}
          className="kf-input-field"
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="kf-input-icon kf-input-icon-right">{icon}</div>
        )}
      </div>

      {error && <span className="kf-input-error-msg">{error}</span>}
      {!error && hint && <span className="kf-input-hint-msg">{hint}</span>}
    </div>
  );
};
