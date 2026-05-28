import React from 'react';
import { Card, Button, Input } from '../components';

export interface PengaturanProps {
  propertyName: string;
  setPropertyName: (val: string) => void;
  dueDateDay: string;
  setDueDateDay: (val: string) => void;
  penaltyPercent: string;
  setPenaltyPercent: (val: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Pengaturan: React.FC<PengaturanProps> = ({
  propertyName,
  setPropertyName,
  dueDateDay,
  setDueDateDay,
  penaltyPercent,
  setPenaltyPercent,
  theme,
  onToggleTheme
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Pengaturan Kos</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Kelola konfigurasi nama kosan, tanggal jatuh tempo sewa, denda keterlambatan, dan utilitas data.</p>
      </div>

      <div className="kf-settings-grid">
        <Card elevation="surface" radius="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)' }}>Detail Informasi Kos</h3>
            
            <div className="kf-form-row">
              <div style={{ flex: 1 }}>
                <Input 
                  label="Nama Kosan"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input 
                  label="Jatuh Tempo Pembayaran (Tanggal)"
                  value={dueDateDay}
                  onChange={(e) => setDueDateDay(e.target.value)}
                  type="number"
                  min="1"
                  max="31"
                  hint="Batas bayar tiap bulan"
                />
              </div>
            </div>

            <div className="kf-form-row">
              <div style={{ flex: 1 }}>
                <Input 
                  label="Denda Terlambat (%)"
                  value={penaltyPercent}
                  onChange={(e) => setPenaltyPercent(e.target.value)}
                  type="number"
                  hint="Denda per bulan jika telat bayar"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', display: 'block', marginBottom: '8px' }}>Format Mata Uang</label>
                <select style={{ height: '40px', padding: '10px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}>
                  <option>Rp (Rupiah Indonesia)</option>
                  <option>$ (US Dollar)</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="outline">Atur Ulang</Button>
              <Button variant="primary" onClick={() => alert('Pengaturan berhasil disimpan!')}>Simpan Pengaturan</Button>
            </div>
          </div>
        </Card>

        <Card elevation="surface" radius="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)' }}>Alat Sistem</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>Ganti Tema</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tema aplikasi saat ini</span>
                </div>
                <Button variant="outline" size="sm" onClick={onToggleTheme}>
                  {theme === 'light' ? 'Set Gelap' : 'Set Terang'}
                </Button>
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>Ekspor Data Kos</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Unduh file cadangan database sewa</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('Data kos berhasil dicadangkan ke perangkat.')}>Ekspor</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
