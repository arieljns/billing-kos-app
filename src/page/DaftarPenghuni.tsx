import React, { useState } from 'react';
import { Property, Transaction } from './types';
import { Card, Button, StatusChip, Modal, Input } from '../components';

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const IconHistory = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export interface DaftarPenghuniProps {
  properties: Property[];
  transactions: Transaction[];
  onOnboardTenant: (
    propertyId: string,
    roomId: string,
    tenantData: { name: string; phone: string; amount: number; due: string; payNow: boolean; method: string }
  ) => void;
}

export const DaftarPenghuni: React.FC<DaftarPenghuniProps> = ({
  properties,
  transactions,
  onOnboardTenant
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // State for tenant payment history modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<{
    propertyName: string;
    roomId: string;
    tenantName: string;
  } | null>(null);

  // State for tenant onboarding modal
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardStep, setOnboardStep] = useState<1 | 2>(1);

  // Tenant Onboarding Form States
  const [onboardName, setOnboardName] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');
  const [onboardStartDate, setOnboardStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [dueDate, setDueDate] = useState('10 Jun 2026');
  const [payNow, setPayNow] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const vacantRooms = selectedProperty
    ? selectedProperty.rooms.filter(r => r.status === 'neutral')
    : [];

  // Helper: check if there are any vacant rooms across all properties
  const allVacantRoomsCount = properties.reduce(
    (count, p) => count + p.rooms.filter(r => r.status === 'neutral').length,
    0
  );

  const handleOpenHistory = (propertyName: string, roomId: string, tenantName: string) => {
    setSelectedTenant({ propertyName, roomId, tenantName });
    setHistoryModalOpen(true);
  };

  // Filter transactions for the selected tenant/room
  const filteredTransactions = selectedTenant
    ? transactions.filter(
        tx =>
          tx.propertyName === selectedTenant.propertyName &&
          tx.room === `Kamar ${selectedTenant.roomId}` &&
          tx.tenant === selectedTenant.tenantName
      )
    : [];

  const handlePropertyChange = (propId: string) => {
    setSelectedPropertyId(propId);
    setSelectedRoomId(''); // Reset room
    setRentAmount(''); // Reset rent amount
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    const room = vacantRooms.find(r => r.id === roomId);
    if (room) {
      setRentAmount(room.amount.toString());
    }
  };

  const handleNextStep = () => {
    if (!onboardName.trim()) {
      alert('Nama penyewa tidak boleh kosong!');
      return;
    }
    if (!onboardPhone.trim()) {
      alert('Nomor WhatsApp tidak boleh kosong!');
      return;
    }
    setOnboardStep(2);
  };

  const handleFinishOnboarding = () => {
    if (!selectedPropertyId) {
      alert('Pilih properti terlebih dahulu!');
      return;
    }
    if (!selectedRoomId) {
      alert('Pilih kamar kosong terlebih dahulu!');
      return;
    }
    if (!rentAmount || Number(rentAmount) <= 0) {
      alert('Masukkan biaya sewa yang valid!');
      return;
    }

    onOnboardTenant(selectedPropertyId, selectedRoomId, {
      name: onboardName,
      phone: onboardPhone,
      amount: Number(rentAmount),
      due: dueDate,
      payNow,
      method: paymentMethod
    });

    // Reset onboarding form and close
    setOnboardName('');
    setOnboardPhone('');
    setOnboardStartDate(new Date().toISOString().split('T')[0]);
    setSelectedPropertyId('');
    setSelectedRoomId('');
    setRentAmount('');
    setPayNow(true);
    setPaymentMethod('Tunai');
    setOnboardStep(1);
    setOnboardingOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header bar with Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Daftar Penghuni Kost
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Data kontak penyewa kos dan status pembayaran sewa aktif dikelompokkan per properti.
          </p>
        </div>
        <Button icon={<IconPlus />} onClick={() => setOnboardingOpen(true)}>
          Pendaftaran Baru
        </Button>
      </div>

      {properties.map(property => {
        // Get active rooms (rooms with tenants) for this property
        const occupiedRooms = property.rooms.filter(r => r.status !== 'neutral');

        return (
          <div key={property.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Property Section Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '6px' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '17px', color: 'var(--color-text-primary)' }}>
                {property.name}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                {occupiedRooms.length} Penghuni Aktif
              </span>
            </div>

            {occupiedRooms.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                Belum ada penghuni aktif di properti ini.
              </div>
            ) : (
              <Card elevation="surface" padding="none" radius="lg">
                <table className="kf-responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-low)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>Kamar</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>Penghuni</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>Nomor WA</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>Uang Sewa</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupiedRooms.map(room => (
                      <tr key={room.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td data-label="Kamar" style={{ padding: '14px 16px', fontWeight: 700 }}>Kamar {room.id}</td>
                        <td data-label="Penghuni" style={{ padding: '14px 16px', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)' }}>
                              {room.tenant.substring(0, 2).toUpperCase()}
                            </span>
                            {room.tenant}
                          </div>
                        </td>
                        <td data-label="Nomor WA" style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{room.phone}</td>
                        <td data-label="Uang Sewa" style={{ padding: '14px 16px', fontWeight: 700 }}>Rp {formatNumber(room.amount)}</td>
                        <td data-label="Status" style={{ padding: '14px 16px' }}>
                          <StatusChip variant={room.status} label={room.label} />
                        </td>
                        <td data-label="Aksi" style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <Button variant="outline" size="sm" icon={<IconPhone />} onClick={() => alert(`Membuka WhatsApp ke ${room.phone} untuk mengirimkan tagihan.`)}>
                              Kirim WA
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<IconHistory />}
                              onClick={() => handleOpenHistory(property.name, room.id, room.tenant)}
                            >
                              Riwayat
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        );
      })}

      {/* Payment History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Riwayat Pembayaran Sewa`}
        size="md"
        footer={
          <Button variant="outline" onClick={() => setHistoryModalOpen(false)}>
            Tutup
          </Button>
        }
      >
        {selectedTenant && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Properti / Kamar</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {selectedTenant.propertyName} • Kamar {selectedTenant.roomId}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Nama Penghuni</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>
                {selectedTenant.tenantName}
              </div>
            </div>

            <h4 style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 700 }}>Catatan Transaksi Masuk</h4>

            {filteredTransactions.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                Belum ada transaksi pembayaran yang dicatat untuk periode ini.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {filteredTransactions.map(tx => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface-lowest)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{tx.date}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Metode: {tx.method} • ID: {tx.id}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-success)' }}>
                        {tx.amount}
                      </span>
                      <StatusChip variant={tx.status} label={tx.label} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Tenant Onboarding Wizard Modal */}
      <Modal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        title="Formulir Pendaftaran Penghuni Baru"
        size="md"
        footer={
          onboardStep === 1 ? (
            <>
              <Button variant="outline" onClick={() => setOnboardingOpen(false)}>Batal</Button>
              {allVacantRoomsCount > 0 && (
                <Button variant="primary" onClick={handleNextStep}>Lanjut ke Langkah 2</Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOnboardStep(1)}>Kembali</Button>
              <Button variant="secondary" onClick={handleFinishOnboarding} disabled={!selectedRoomId}>
                Selesaikan Pendaftaran
              </Button>
            </>
          )
        }
      >
        {allVacantRoomsCount === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '36px' }}>⚠️</span>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Kamar Kosong Penuh</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', margin: 0 }}>
              Tidak ada unit kamar kosong di seluruh properti Anda. Silakan buat unit kamar baru terlebih dahulu di halaman <strong>Kelola Properti</strong>.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>1</span>
                <span style={{ fontWeight: onboardStep === 1 ? 700 : 500, color: onboardStep === 1 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>Identitas</span>
              </div>
              <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: 'var(--radius-full)', backgroundColor: onboardStep === 2 ? 'var(--color-primary)' : 'var(--color-surface-low)', color: onboardStep === 2 ? '#ffffff' : 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>2</span>
                <span style={{ fontWeight: onboardStep === 2 ? 700 : 500, color: onboardStep === 2 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>Kamar & Bayar</span>
              </div>
            </div>

            {onboardStep === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  label="Nama Lengkap Penyewa"
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="Contoh: Joko Susilo"
                  required
                />

                <Input
                  label="Nomor WhatsApp (Aktif)"
                  value={onboardPhone}
                  onChange={(e) => setOnboardPhone(e.target.value)}
                  placeholder="Contoh: +62 899-1234-5678"
                  required
                  hint="Untuk pengiriman tagihan otomatis."
                />

                <Input
                  label="Tanggal Mulai Sewa"
                  type="date"
                  value={onboardStartDate}
                  onChange={(e) => setOnboardStartDate(e.target.value)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>Penyewa: <strong>{onboardName} ({onboardPhone})</strong></div>
                  <div>Mulai Sewa: <strong>{onboardStartDate}</strong></div>
                </div>

                <div className="kf-form-row">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Pilih Properti (Wajib)</label>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
                    >
                      <option value="">-- Pilih Properti --</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Pilih Kamar (Kamar Kosong)</label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => handleRoomChange(e.target.value)}
                      disabled={!selectedPropertyId}
                      style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
                    >
                      <option value="">-- Pilih Kamar --</option>
                      {vacantRooms.map(r => (
                        <option key={r.id} value={r.id}>Kamar {r.id} ({r.type})</option>
                      ))}
                    </select>
                    {selectedPropertyId && vacantRooms.length === 0 && (
                      <span style={{ fontSize: '10px', color: 'var(--color-error)' }}>Tidak ada kamar kosong.</span>
                    )}
                  </div>
                </div>

                <div className="kf-form-row">
                  <div style={{ flex: 1 }}>
                    <Input
                      label="Biaya Sewa Disepakati"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(e.target.value)}
                      icon={<span>Rp</span>}
                      type="number"
                      disabled={!selectedRoomId}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <Input
                      label="Jatuh Tempo Tagihan"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={!selectedRoomId}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Status Pembayaran Sewa Pertama</label>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="radio"
                        name="modalPayNow"
                        checked={payNow}
                        onChange={() => setPayNow(true)}
                        disabled={!selectedRoomId}
                      />
                      <span>Ya, Lunas Sekarang</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="radio"
                        name="modalPayNow"
                        checked={!payNow}
                        onChange={() => setPayNow(false)}
                        disabled={!selectedRoomId}
                      />
                      <span>Belum Bayar (Nunggak)</span>
                    </label>
                  </div>

                  {payNow && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '250px', marginTop: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Metode Pembayaran</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!selectedRoomId}
                        style={{ height: '36px', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
                      >
                        <option value="Tunai">Uang Tunai (Cash)</option>
                        <option value="Transfer (Mandiri)">Transfer Mandiri</option>
                        <option value="Transfer (BCA)">Transfer BCA</option>
                        <option value="Transfer Gopay">Gopay / OVO</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
