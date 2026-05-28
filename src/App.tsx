import { useState, useEffect } from 'react';
import './App.css';
import {
  Button,
  Card,
  Modal,
  StatusChip,
  Input,
  ProgressBar,
  BalanceSummary,
  Layout
} from './components';

// SVG Icons
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

interface Room {
  id: string;
  type: string;
  tenant: string;
  phone: string;
  amount: number;
  status: 'success' | 'error' | 'warning' | 'neutral';
  label: string;
  period: number; 
  due: string;
}

interface Transaction {
  id: string;
  room: string;
  tenant: string;
  amount: string;
  date: string;
  method: string;
  status: 'success' | 'error' | 'warning' | 'neutral';
  label: string;
}

function App() {
  // Theme management state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kf-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  
  const [currentPage, setCurrentPage] = useState('dashboard');
  

  const [rooms, setRooms] = useState<Room[]>([
    { id: '101', type: 'Kamar Standar', tenant: 'Budi Santoso', phone: '+62 812-3456-7890', amount: 2450000, status: 'success', label: 'Lunas', period: 80, due: '10 Jun 2026' },
    { id: '102', type: 'Kamar Standar', tenant: 'Siti Rahma', phone: '+62 821-9876-5432', amount: 2450000, status: 'success', label: 'Lunas', period: 95, due: '10 Jun 2026' },
    { id: '201', type: 'Kamar Deluxe', tenant: 'Rian Hidayat', phone: '+62 813-5555-4433', amount: 2800000, status: 'warning', label: 'Konfirmasi', period: 65, due: '10 Jun 2026' },
    { id: '202', type: 'Kamar Deluxe', tenant: 'Dewi Lestari', phone: '+62 878-1234-5678', amount: 2800000, status: 'success', label: 'Lunas', period: 70, due: '10 Jun 2026' },
    { id: '301', type: 'Kamar Suite', tenant: 'Farhan Alamsyah', phone: '+62 856-7777-8888', amount: 3500000, status: 'success', label: 'Lunas', period: 40, due: '12 Jun 2026' },
    { id: '302', type: 'Kamar Suite', tenant: 'Amelia Putri', phone: '+62 811-2222-3333', amount: 3100000, status: 'error', label: 'Nunggak', period: 100, due: '25 Mei 2026' },
    { id: '103', type: 'Kamar Standar', tenant: 'Kosong', phone: '-', amount: 2450000, status: 'neutral', label: 'Kosong', period: 0, due: '-' },
    { id: '203', type: 'Kamar Deluxe', tenant: 'Kosong', phone: '-', amount: 2800000, status: 'neutral', label: 'Kosong', period: 0, due: '-' }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-4819', room: 'Kamar 101', tenant: 'Budi Santoso', amount: 'Rp 2.450.000', date: '28-05-2026', method: 'Tunai', status: 'success', label: 'Lunas' },
    { id: 'TX-4818', room: 'Kamar 202', tenant: 'Dewi Lestari', amount: 'Rp 2.800.000', date: '27-05-2026', method: 'Transfer (BCA)', status: 'success', label: 'Lunas' },
    { id: 'TX-4817', room: 'Kamar 301', tenant: 'Farhan Alamsyah', amount: 'Rp 3.500.000', date: '26-05-2026', method: 'Transfer (Mandiri)', status: 'success', label: 'Lunas' },
    { id: 'TX-4816', room: 'Kamar 102', tenant: 'Siti Rahma', amount: 'Rp 2.450.000', date: '25-05-2026', method: 'Gopay', status: 'success', label: 'Lunas' }
  ]);

  // Modal control state
  const [selectedRoomForPayment, setSelectedRoomForPayment] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [modalMethod, setModalMethod] = useState('Tunai');

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Setting inputs states
  const [propertyName, setPropertyName] = useState('Kost Asri Sleman');
  const [dueDateDay, setDueDateDay] = useState('10');
  const [penaltyPercent, setPenaltyPercent] = useState('5');

  // Calculate dynamic stats
  const occupiedRoomsCount = rooms.filter(r => r.status !== 'neutral').length;
  const totalRoomsCount = rooms.length;
  const occupancyPercentage = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  const totalExpectedAmount = rooms
    .filter(r => r.status !== 'neutral')
    .reduce((sum, r) => sum + r.amount, 0);

  const collectedAmount = rooms
    .filter(r => r.status === 'success')
    .reduce((sum, r) => sum + r.amount, 0);

  const overdueAmount = rooms
    .filter(r => r.status === 'error')
    .reduce((sum, r) => sum + r.amount, 0);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleOpenPaymentModal = (room: Room) => {
    setSelectedRoomForPayment(room);
    setModalAmount(room.amount.toString());
    setModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedRoomForPayment) return;

    // Update Room status locally
    setRooms(prevRooms =>
      prevRooms.map(r =>
        r.id === selectedRoomForPayment.id
          ? { ...r, status: 'success', label: 'Lunas', due: '10 Jun 2026' }
          : r
      )
    );

    // Append new transaction to list
    const newTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      room: `Kamar ${selectedRoomForPayment.id}`,
      tenant: selectedRoomForPayment.tenant,
      amount: `Rp ${formatNumber(Number(modalAmount))}`,
      date: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      method: modalMethod,
      status: 'success',
      label: 'Lunas'
    };

    setTransactions([newTx, ...transactions]);
    setModalOpen(false);
  };

  // Filtered rooms list based on search bar
  const filteredRooms = rooms.filter(room =>
    room.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.id.includes(searchQuery) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout
      currentPageId={currentPage}
      onPageChange={setCurrentPage}
      theme={theme}
      onToggleTheme={toggleTheme}
      brandName="KosFlow Suite"
      profileName="Ariel J."
      profileRole="Pengelola Kos"
    >
      {/* Page Routing */}
      
      {currentPage === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Welcome Intro Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Ringkasan Kost
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              Data pembayaran sewa dan status hunian untuk **{propertyName}** • Periode Tagihan Juni 2026.
            </p>
          </div>

          {/* Dynamic Metrics Grid */}
          <div className="kf-metrics-grid">
            
            <BalanceSummary
              title="Total Uang Sewa Lunas"
              amount={formatNumber(collectedAmount)}
              currency="Rp"
              trend={{
                value: '8.4%',
                label: 'vs pemasukan Mei',
                isPositive: true
              }}
              details={[
                { label: 'Target Total Sewa', value: `Rp ${formatNumber(totalExpectedAmount)}` },
                { label: 'Total Belum Bayar', value: `Rp ${formatNumber(overdueAmount)}`, color: 'error' }
              ]}
            />

            <Card elevation="surface" padding="md" radius="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tingkat Hunian Kamar</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                    <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '30px', fontWeight: 800 }}>{occupiedRoomsCount}</h2>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>/ {totalRoomsCount} Kamar Terisi</span>
                  </div>
                </div>
                
                <ProgressBar 
                  value={occupancyPercentage} 
                  showValue 
                  variant="success" 
                  label="Target Kapasitas Kos"
                />

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <span>Sewa Aktif: {occupiedRoomsCount} Kamar</span>
                  <span>Kamar Kosong: {totalRoomsCount - occupiedRoomsCount} Kamar</span>
                </div>
              </div>
            </Card>

            <Card elevation="surface" padding="md" radius="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peringatan Nunggak</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                    <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '30px', fontWeight: 800, color: 'var(--color-error)' }}>
                      {rooms.filter(r => r.status === 'error').length}
                    </h2>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Kamar Belum Bayar</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rooms.filter(r => r.status === 'error').map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-error-bg)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-error-light)' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-error)' }}>Kamar {r.id}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.tenant}</span>
                    </div>
                  ))}
                  {rooms.filter(r => r.status === 'error').length === 0 && (
                    <div style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
                      ✓ Semua pembayaran selesai!
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Batas Pembayaran: **Tanggal {dueDateDay} tiap bulan**
                </div>
              </div>
            </Card>

          </div>

          {/* Search bar and Filters */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Cari berdasarkan Nomor Kamar atau Nama Penghuni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<IconSearch />}
              />
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>Hapus</Button>
            )}
          </div>

          {/* Main Dashboard Panel - Room Grid & Transaction List */}
          <div className="kf-mockup-dashboard-layout">
            
            {/* Rooms list container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '17px', color: 'var(--color-text-primary)' }}>
                Daftar Status Kamar
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filteredRooms.map(room => (
                  <Card
                    key={room.id}
                    elevation="surface"
                    radius="lg"
                    header={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-primary)' }}>Kamar {room.id}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>• {room.type}</span>
                        </div>
                        <StatusChip variant={room.status} label={room.label} pulse={room.status === 'error' || room.status === 'warning'} />
                      </div>
                    }
                    footer={
                      <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end' }}>
                        {room.status === 'neutral' ? (
                          <Button variant="outline" size="sm">Sewa Kamar</Button>
                        ) : (
                          <>
                            {room.status !== 'success' && (
                              <Button variant="secondary" size="sm" onClick={() => handleOpenPaymentModal(room)}>
                                Catat Bayar
                              </Button>
                            )}
                            <Button variant="outline" size="sm" icon={<IconEdit />} />
                          </>
                        )}
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Penyewa:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{room.tenant}</span>
                      </div>
                      
                      {room.status !== 'neutral' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Batas Waktu:</span>
                            <span style={{ fontWeight: 600, color: room.status === 'error' ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
                              {room.due}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Biaya Sewa:</span>
                            <span style={{ fontWeight: 700 }}>Rp {formatNumber(room.amount)}</span>
                          </div>

                          <div style={{ marginTop: '4px' }}>
                            <ProgressBar value={room.period} variant={room.status === 'error' ? 'error' : room.status === 'warning' ? 'primary' : 'success'} size="sm" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                              <span>Masa Sewa</span>
                              <span>{room.period}%</span>
                            </div>
                          </div>
                        </>
                      )}

                      {room.status === 'neutral' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>Harga Kamar:</span>
                          <span style={{ fontWeight: 700 }}>Rp {formatNumber(room.amount)}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transactions Activity List - Collapsed/Hidden on Mobile for cleaner UX */}
            <div className="kf-mobile-hide" style={{ flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '17px', color: 'var(--color-text-primary)' }}>
                Riwayat Transaksi Terbaru
              </h3>
              
              <Card elevation="surface" radius="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {transactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: idx === transactions.length - 1 ? '0' : '12px',
                        borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="kf-transaction-icon-box" style={{ background: 'var(--color-primary-light)' }}>
                          <span>{tx.room.split(' ')[1]}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px' }}>{tx.room} • {tx.tenant}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {tx.date} • {tx.method}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-success)' }}>
                          {tx.amount}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                          {tx.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>

        </div>
      )}

      {currentPage === 'rooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800 }}>Daftar Kamar Kost</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Atur data kamar, harga sewa, dan penyewa aktif.</p>
            </div>
            <Button icon={<IconPlus />}>Tambah Kamar</Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {rooms.map(room => (
              <Card 
                key={room.id} 
                elevation="surface"
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontWeight: 800 }}>Kamar {room.id}</span>
                    <StatusChip variant={room.status} label={room.label} />
                  </div>
                }
                footer={
                  <>
                    <Button variant="outline" size="sm">Atur Kamar</Button>
                  </>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Tipe Kamar:</span>
                    <span style={{ fontWeight: 600 }}>{room.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Biaya Sewa:</span>
                    <span style={{ fontWeight: 700 }}>Rp {formatNumber(room.amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Penyewa:</span>
                    <span style={{ fontWeight: 600 }}>{room.tenant}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'tenants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800 }}>Daftar Penghuni Kost</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Informasi kontak penyewa kos dan status pembayaran tagihan sewa bulanan.</p>
          </div>

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
                {rooms.filter(r => r.status !== 'neutral').map(room => (
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
                        <Button variant="outline" size="sm">Riwayat</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {currentPage === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800 }}>Riwayat Keuangan</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Daftar lengkap kuitansi pembayaran uang sewa kos yang telah dicatat.</p>
          </div>

          <Card elevation="surface" padding="none" radius="lg">
            <table className="kf-responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-low)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>ID Transaksi</th>
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
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {currentPage === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800 }}>Pengaturan Kos</h1>
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
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
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
      )}

      {/* Shared Scrim Modal for Recording Cash Rent */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Formulir Catat Pembayaran Uang Sewa"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="secondary" onClick={handleConfirmPayment}>
              Simpan Pembayaran
            </Button>
          </>
        }
      >
        {selectedRoomForPayment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ marginBottom: '8px', fontSize: '13px' }}>
              Isi data transaksi masuk untuk mencatat pembayaran kos. Status kamar akan otomatis berubah menjadi **Lunas**.
            </p>
            
            <Input 
              label="Detail Kamar & Penyewa" 
              value={`Kamar ${selectedRoomForPayment.id} • ${selectedRoomForPayment.tenant}`}
              disabled
            />

            <div className="kf-form-row">
              <div style={{ flex: 1 }}>
                <Input 
                  label="Jumlah Uang Diterima"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  icon={<span>Rp</span>}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input 
                  label="Tanggal Transaksi"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)' }}>Metode Penerimaan</label>
              <select 
                value={modalMethod} 
                onChange={(e) => setModalMethod(e.target.value)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Tunai">Uang Tunai (Cash)</option>
                <option value="Transfer (Mandiri)">Transfer Bank Mandiri</option>
                <option value="Transfer (BCA)">Transfer Bank BCA</option>
                <option value="Transfer Gopay">Dompet Digital (Gopay/OVO)</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

    </Layout>
  );
}

export default App;
