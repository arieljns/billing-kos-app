import { useState, useEffect } from 'react';
import './App.css';
import {
  Button,
  Input,
  Modal,
  Layout
} from './components';
import {
  Property,
  Room,
  Transaction,
  Ringkasan,
  KelolaProperti,
  DaftarPenghuni,
  RiwayatKeuangan,
  Pengaturan
} from './page';

function App() {
  // Splash screen states
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFadeOut, setSplashFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFadeOut(true);
    }, 1800);
    const removeTimer = setTimeout(() => {
      setSplashVisible(false);
    }, 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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

  // Page selection state
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Interactive properties & rooms database state
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'prop-1',
      name: 'Kost Asri Sleman',
      type: 'Kos',
      address: 'Jl. Kaliurang Km 5, Sleman, DIY',
      rentType: 'Bulanan',
      paymentTerms: 'Bayar di Depan',
      status: 'Aktif',
      rooms: [
        { id: '101', type: 'Kamar Standar', tenant: 'Budi Santoso', phone: '+62 812-3456-7890', amount: 2450000, status: 'success', label: 'Lunas', period: 80, due: '10 Jun 2026' },
        { id: '102', type: 'Kamar Standar', tenant: 'Siti Rahma', phone: '+62 821-9876-5432', amount: 2450000, status: 'success', label: 'Lunas', period: 95, due: '10 Jun 2026' },
        { id: '103', type: 'Kamar Standar', tenant: 'Kosong', phone: '-', amount: 2450000, status: 'neutral', label: 'Kosong', period: 0, due: '-' },
        { id: '201', type: 'Kamar Deluxe', tenant: 'Rian Hidayat', phone: '+62 813-5555-4433', amount: 2800000, status: 'warning', label: 'Konfirmasi', period: 65, due: '10 Jun 2026' },
        { id: '202', type: 'Kamar Deluxe', tenant: 'Dewi Lestari', phone: '+62 878-1234-5678', amount: 2800000, status: 'success', label: 'Lunas', period: 70, due: '10 Jun 2026' },
        { id: '203', type: 'Kamar Deluxe', tenant: 'Kosong', phone: '-', amount: 2800000, status: 'neutral', label: 'Kosong', period: 0, due: '-' }
      ]
    },
    {
      id: 'prop-2',
      name: 'Apartemen Melati',
      type: 'Apartemen',
      address: 'Jl. Margonda Raya No. 12, Depok',
      rentType: 'Tahunan',
      paymentTerms: 'Bayar di Depan',
      status: 'Aktif',
      rooms: [
        { id: '301', type: 'Kamar Suite', tenant: 'Farhan Alamsyah', phone: '+62 856-7777-8888', amount: 3500000, status: 'success', label: 'Lunas', period: 40, due: '12 Jun 2026' },
        { id: '302', type: 'Kamar Suite', tenant: 'Amelia Putri', phone: '+62 811-2222-3333', amount: 3100000, status: 'error', label: 'Nunggak', period: 100, due: '25 Mei 2026' }
      ]
    },
    {
      id: 'prop-3',
      name: 'Kontrakan Pak Haji',
      type: 'Kontrakan',
      address: 'Gang Masjid No. 5, Jakarta Selatan',
      rentType: 'Bulanan',
      paymentTerms: 'Bayar di Belakang',
      status: 'Renovasi',
      rooms: [
        { id: 'Unit A', type: 'Rumah 2 Kamar', tenant: 'Budi Setiawan', phone: '+62 812-9999-0000', amount: 4500000, status: 'success', label: 'Lunas', period: 50, due: '15 Jun 2026' },
        { id: 'Unit B', type: 'Rumah 2 Kamar', tenant: 'Kosong', phone: '-', amount: 4500000, status: 'neutral', label: 'Kosong', period: 0, due: '-' }
      ]
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-4819', propertyId: 'prop-1', propertyName: 'Kost Asri Sleman', room: 'Kamar 101', tenant: 'Budi Santoso', amount: 'Rp 2.450.000', date: '28-05-2026', method: 'Tunai', status: 'success', label: 'Lunas' },
    { id: 'TX-4818', propertyId: 'prop-1', propertyName: 'Kost Asri Sleman', room: 'Kamar 202', tenant: 'Dewi Lestari', amount: 'Rp 2.800.000', date: '27-05-2026', method: 'Transfer (BCA)', status: 'success', label: 'Lunas' },
    { id: 'TX-4817', propertyId: 'prop-2', propertyName: 'Apartemen Melati', room: 'Kamar 301', tenant: 'Farhan Alamsyah', amount: 'Rp 3.500.000', date: '26-05-2026', method: 'Transfer (Mandiri)', status: 'success', label: 'Lunas' },
    { id: 'TX-4816', propertyId: 'prop-1', propertyName: 'Kost Asri Sleman', room: 'Kamar 102', tenant: 'Siti Rahma', amount: 'Rp 2.450.000', date: '25-05-2026', method: 'Gopay', status: 'success', label: 'Lunas' }
  ]);

  // Modal control state
  const [selectedRoomForPayment, setSelectedRoomForPayment] = useState<{ propertyId: string; room: Room } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [modalMethod, setModalMethod] = useState('Tunai');

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Setting inputs states
  const [propertyName, setPropertyName] = useState('Kost Asri Sleman');
  const [dueDateDay, setDueDateDay] = useState('10');
  const [penaltyPercent, setPenaltyPercent] = useState('5');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleOpenPaymentModal = (propertyId: string, room: Room) => {
    setSelectedRoomForPayment({ propertyId, room });
    setModalAmount(room.amount.toString());
    setModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedRoomForPayment) return;
    const { propertyId, room } = selectedRoomForPayment;

    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;

    setProperties(prevProps =>
      prevProps.map(p =>
        p.id === propertyId
          ? {
              ...p,
              rooms: p.rooms.map(r =>
                r.id === room.id
                  ? { ...r, status: 'success', label: 'Lunas', due: '10 Jun 2026' }
                  : r
              )
            }
          : p
      )
    );

    const newTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: propertyId,
      propertyName: prop.name,
      room: `Kamar ${room.id}`,
      tenant: room.tenant,
      amount: `Rp ${formatNumber(Number(modalAmount))}`,
      date: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      method: modalMethod,
      status: 'success',
      label: 'Lunas'
    };

    setTransactions([newTx, ...transactions]);
    setModalOpen(false);
  };

  const handleAddProperty = (newProp: Omit<Property, 'id' | 'rooms'>) => {
    const property: Property = {
      ...newProp,
      id: `prop-${Math.floor(1000 + Math.random() * 9000)}`,
      rooms: []
    };
    setProperties([...properties, property]);
  };

  const handleEditProperty = (propertyId: string, updatedFields: Partial<Property>) => {
    setProperties(prevProps =>
      prevProps.map(p => (p.id === propertyId ? { ...p, ...updatedFields } : p))
    );
  };

  const handleAddRoomToProperty = (propertyId: string, newRoom: Omit<Room, 'status' | 'label' | 'period' | 'due'>) => {
    const room: Room = {
      ...newRoom,
      status: 'neutral',
      label: 'Kosong',
      period: 0,
      due: '-'
    };
    setProperties(prevProps =>
      prevProps.map(p =>
        p.id === propertyId ? { ...p, rooms: [...p.rooms, room] } : p
      )
    );
  };

  const handleOnboardTenant = (
    propertyId: string,
    roomId: string,
    tenantData: { name: string; phone: string; amount: number; due: string; payNow: boolean; method: string }
  ) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;

    setProperties(prevProps =>
      prevProps.map(p =>
        p.id === propertyId
          ? {
              ...p,
              rooms: p.rooms.map(r =>
                r.id === roomId
                  ? {
                      ...r,
                      tenant: tenantData.name,
                      phone: tenantData.phone,
                      amount: tenantData.amount,
                      status: tenantData.payNow ? 'success' : 'warning',
                      label: tenantData.payNow ? 'Lunas' : 'Konfirmasi',
                      due: tenantData.due,
                      period: tenantData.payNow ? 100 : 0
                    }
                  : r
              )
            }
          : p
      )
    );

    if (tenantData.payNow) {
      const newTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        propertyId: propertyId,
        propertyName: prop.name,
        room: `Kamar ${roomId}`,
        tenant: tenantData.name,
        amount: `Rp ${formatNumber(tenantData.amount)}`,
        date: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
        method: tenantData.method,
        status: 'success',
        label: 'Lunas'
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    setCurrentPage('dashboard');
  };

  return (
    <>
      {splashVisible && (
        <div className={`kf-splash-screen ${splashFadeOut ? 'fade-out' : ''}`}>
          <div className="kf-splash-content">
            <img src="/logo.png" alt="KosFlow Logo" className="kf-splash-logo" />
            <h1 className="kf-splash-title">KosFlow Suite</h1>
            <p className="kf-splash-subtitle">Sistem Manajemen Properti Praktis</p>
            <div className="kf-splash-loader">
              <div className="kf-splash-loader-bar" />
            </div>
          </div>
        </div>
      )}
      <Layout
      currentPageId={currentPage}
      onPageChange={setCurrentPage}
      theme={theme}
      onToggleTheme={toggleTheme}
      brandName="KosFlow Suite"
      profileName="Ariel J."
      profileRole="Pengelola Kos"
    >
      {/* Page Views Routing */}
      {currentPage === 'dashboard' && (
        <Ringkasan
          properties={properties}
          transactions={transactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dueDateDay={dueDateDay}
          onOpenPayment={handleOpenPaymentModal}
        />
      )}

      {currentPage === 'rooms' && (
        <KelolaProperti
          properties={properties}
          onOpenPayment={handleOpenPaymentModal}
          onAddProperty={handleAddProperty}
          onEditProperty={handleEditProperty}
          onAddRoom={handleAddRoomToProperty}
        />
      )}

      {currentPage === 'tenants' && (
        <DaftarPenghuni
          properties={properties}
          transactions={transactions}
          onOnboardTenant={handleOnboardTenant}
        />
      )}

      {currentPage === 'billing' && (
        <RiwayatKeuangan
          transactions={transactions}
        />
      )}

      {currentPage === 'settings' && (
        <Pengaturan
          propertyName={propertyName}
          setPropertyName={setPropertyName}
          dueDateDay={dueDateDay}
          setDueDateDay={setDueDateDay}
          penaltyPercent={penaltyPercent}
          setPenaltyPercent={setPenaltyPercent}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
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
              value={`${properties.find(p => p.id === selectedRoomForPayment.propertyId)?.name || ''} • Kamar ${selectedRoomForPayment.room.id} • ${selectedRoomForPayment.room.tenant}`}
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
    </>
  );
}

export default App;
