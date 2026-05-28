import React from 'react';
import './BalanceSummary.css';
import { Card } from './Card';

export interface BalanceDetail {
  label: string;
  value: string | number;
  color?: 'default' | 'success' | 'error';
}

export interface BalanceSummaryProps {
  title?: string;
  amount: string | number;
  currency?: string;
  trend?: {
    value: string;
    label: string;
    isPositive: boolean;
  };
  details?: BalanceDetail[];
  actions?: React.ReactNode;
  className?: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  title = 'Balance Summary',
  amount,
  currency = 'Rp',
  trend,
  details = [],
  actions,
  className = ''
}) => {
  return (
    <Card 
      elevation="elevated" 
      padding="lg" 
      radius="lg" 
      className={`kf-balance-summary ${className}`}
    >
      <div className="kf-balance-content-wrapper">
        <div className="kf-balance-main-section">
          <span className="kf-balance-title">{title}</span>
          <div className="kf-balance-amount-row">
            <span className="kf-balance-currency">{currency}</span>
            <h1 className="kf-balance-amount">{amount}</h1>
          </div>
          
          {trend && (
            <div className="kf-balance-trend-row">
              <span className={`kf-balance-trend-badge ${trend.isPositive ? 'is-positive' : 'is-negative'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="kf-balance-trend-label">{trend.label}</span>
            </div>
          )}
        </div>

        {details.length > 0 && (
          <div className="kf-balance-details-divider" />
        )}

        {details.length > 0 && (
          <div className="kf-balance-details-grid">
            {details.map((detail, idx) => (
              <div className="kf-balance-detail-item" key={idx}>
                <span className="kf-balance-detail-label">{detail.label}</span>
                <span className={`kf-balance-detail-value val-${detail.color || 'default'}`}>
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {actions && (
        <div className="kf-balance-actions">
          {actions}
        </div>
      )}
    </Card>
  );
};
