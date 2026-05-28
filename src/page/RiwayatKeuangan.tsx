import React from 'react';
import { Transaction } from './types';
import { Card, StatusChip } from '../components';

export interface RiwayatKeuanganProps {
  transactions: Transaction[];
}

export const RiwayatKeuangan: React.FC<RiwayatKeuanganProps> = ({ transactions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Riwayat Keuangan</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Daftar lengkap kuitansi pembayaran uang sewa kos yang telah dicatat.</p>
      </div>

      <Card elevation="surface" padding="none" radius="lg">
        <table className="kf-responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-low)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>ID Transaksi</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Properti</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Kamar</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Penyewa</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Metode</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Jumlah</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Tanggal</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td data-label="ID Transaksi" style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{tx.id}</td>
                <td data-label="Properti" style={{ padding: '14px 16px', fontWeight: 600 }}>{tx.propertyName}</td>
                <td data-label="Kamar" style={{ padding: '14px 16px', fontWeight: 700 }}>{tx.room}</td>
                <td data-label="Penyewa" style={{ padding: '14px 16px', fontWeight: 600 }}>{tx.tenant}</td>
                <td data-label="Metode" style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>{tx.method}</td>
                <td data-label="Jumlah" style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-success)' }}>{tx.amount}</td>
                <td data-label="Tanggal" style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>{tx.date}</td>
                <td data-label="Status" style={{ padding: '14px 16px' }}>
                  <StatusChip variant={tx.status} label={tx.label} />
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  Belum ada riwayat transaksi pembayaran masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
