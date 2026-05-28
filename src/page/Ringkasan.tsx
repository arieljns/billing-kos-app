import React, { useState } from 'react';
import { Property, Room, Transaction } from './types';
import { Card, Button, StatusChip, ProgressBar, BalanceSummary, Input } from '../components';

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export interface RingkasanProps {
  properties: Property[];
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dueDateDay: string;
  onOpenPayment: (propertyId: string, room: Room) => void;
}

export const Ringkasan: React.FC<RingkasanProps> = ({
  properties,
  transactions,
  searchQuery,
  setSearchQuery,
  dueDateDay,
  onOpenPayment
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Map rooms with property parent metadata for flat searching/grouping
  const allRoomsWithMeta = properties.flatMap(p =>
    p.rooms.map(r => ({
      ...r,
      propertyId: p.id,
      propertyName: p.name,
      rentType: p.rentType,
      paymentTerms: p.paymentTerms
    }))
  );

  // Compute metrics based on selected property filter
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const activeRooms = selectedProperty
    ? selectedProperty.rooms.map(r => ({
        ...r,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        rentType: selectedProperty.rentType,
        paymentTerms: selectedProperty.paymentTerms
      }))
    : allRoomsWithMeta;

  const occupiedRoomsCount = activeRooms.filter(r => r.status !== 'neutral').length;
  const totalRoomsCount = activeRooms.length;
  const occupancyPercentage = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

  const totalExpectedAmount = activeRooms
    .filter(r => r.status !== 'neutral')
    .reduce((sum, r) => sum + r.amount, 0);

  const collectedAmount = activeRooms
    .filter(r => r.status === 'success')
    .reduce((sum, r) => sum + r.amount, 0);

  const overdueAmount = activeRooms
    .filter(r => r.status === 'error')
    .reduce((sum, r) => sum + r.amount, 0);

  // Search rooms
  const filteredRoomsWithMeta = allRoomsWithMeta.filter(room => {
    const matchesProperty = selectedPropertyId === 'all' || room.propertyId === selectedPropertyId;
    const matchesSearch = searchQuery === '' ||
      room.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProperty && matchesSearch;
  });

  // Group filtered rooms by property for structured display
  const roomsGroupedByProperty = filteredRoomsWithMeta.reduce((groups, room) => {
    if (!groups[room.propertyId]) {
      groups[room.propertyId] = {
        propertyName: room.propertyName,
        rentType: room.rentType,
        paymentTerms: room.paymentTerms,
        rooms: []
      };
    }
    groups[room.propertyId].rooms.push(room);
    return groups;
  }, {} as Record<string, { propertyName: string; rentType: string; paymentTerms: string; rooms: typeof filteredRoomsWithMeta }>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Intro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Ringkasan Keuangan & Hunian
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Data penagihan properti aktif. Periode Juni 2026.
        </p>
      </div>

      {/* Property Selector Pill Filters */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setSelectedPropertyId('all')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: selectedPropertyId === 'all' ? 'var(--color-primary)' : 'var(--color-surface-low)',
            color: selectedPropertyId === 'all' ? '#ffffff' : 'var(--color-text-primary)',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
        >
          Semua Properti ({properties.length})
        </button>
        {properties.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPropertyId(p.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: selectedPropertyId === p.id ? 'var(--color-primary)' : 'var(--color-surface-low)',
              color: selectedPropertyId === p.id ? '#ffffff' : 'var(--color-text-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            {p.name} ({p.rooms.length})
          </button>
        ))}
      </div>

      {/* Metrics Row */}
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
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>/ {totalRoomsCount} Unit Terisi</span>
              </div>
            </div>
            
            <ProgressBar 
              value={occupancyPercentage} 
              showValue 
              variant="success" 
              label="Kapasitas Properti"
            />

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <span>Sewa Aktif: {occupiedRoomsCount} Unit</span>
              <span>Kosong: {totalRoomsCount - occupiedRoomsCount} Unit</span>
            </div>
          </div>
        </Card>

        <Card elevation="surface" padding="md" radius="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peringatan Belum Bayar</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '30px', fontWeight: 800, color: 'var(--color-error)' }}>
                  {activeRooms.filter(r => r.status === 'error').length}
                </h2>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Penyewa Nunggak</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
              {activeRooms.filter(r => r.status === 'error').map(r => (
                <div key={`${r.propertyId}-${r.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-error-bg)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-error-light)' }}>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-error)' }}>
                    {selectedPropertyId === 'all' ? `${r.propertyName} - ` : ''}Kamar {r.id}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.tenant}</span>
                </div>
              ))}
              {activeRooms.filter(r => r.status === 'error').length === 0 && (
                <div style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ Semua pembayaran selesai!
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Jatuh Tempo: **Tanggal {dueDateDay} tiap bulan**
            </div>
          </div>
        </Card>
      </div>

      {/* Search Filter */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Cari berdasarkan Kamar, Penyewa, atau Nama Properti..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            icon={<IconSearch />}
          />
        </div>
        {searchQuery && (
          <Button variant="outline" onClick={() => setSearchQuery('')}>Hapus</Button>
        )}
      </div>

      {/* Room Grids Grouped by Property */}
      <div className="kf-mockup-dashboard-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {Object.entries(roomsGroupedByProperty).map(([propertyId, group]) => (
            <div key={propertyId} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '17px', color: 'var(--color-text-primary)' }}>
                    {group.propertyName}
                  </h3>
                  <span style={{ fontSize: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    {group.rentType} • {group.paymentTerms}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {group.rooms.length} Unit
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {group.rooms.map(room => (
                  <Card
                    key={`${propertyId}-${room.id}`}
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
                              <Button variant="secondary" size="sm" onClick={() => onOpenPayment(room.propertyId, room)}>
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
          ))}
          {filteredRoomsWithMeta.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface-low)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Tidak ada data yang cocok dengan filter atau pencarian Anda.
            </div>
          )}
        </div>

        {/* Recent Transactions Panel (Hidden on Mobile) */}
        <div className="kf-mobile-hide" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '17px', color: 'var(--color-text-primary)' }}>
            Transaksi Terakhir
          </h3>
          
          <Card elevation="surface" radius="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions
                .filter(tx => selectedPropertyId === 'all' || tx.propertyId === selectedPropertyId)
                .slice(0, 5)
                .map((tx, idx, arr) => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: idx === arr.length - 1 ? '0' : '12px',
                      borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--color-border)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="kf-transaction-icon-box" style={{ background: 'var(--color-primary-light)' }}>
                        <span>{tx.room.split(' ')[1] || 'U'}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{tx.room} • {tx.tenant}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {tx.propertyName} • {tx.date} • {tx.method}
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
              {transactions.filter(tx => selectedPropertyId === 'all' || tx.propertyId === selectedPropertyId).length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  Belum ada transaksi.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};
