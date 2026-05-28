import React, { useState } from 'react';
import { Property, Room } from './types';
import { Card, Button, Input, Modal, StatusChip } from '../components';

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconChevron = ({ expanded }: { expanded: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
);

export interface KelolaPropertiProps {
  properties: Property[];
  onOpenPayment: (propertyId: string, room: Room) => void;
  onAddProperty: (newProp: Omit<Property, 'id' | 'rooms'>) => void;
  onEditProperty: (propertyId: string, updatedFields: Partial<Property>) => void;
  onAddRoom: (propertyId: string, newRoom: Omit<Room, 'status' | 'label' | 'period' | 'due'>) => void;
}

export const KelolaProperti: React.FC<KelolaPropertiProps> = ({
  properties,
  onOpenPayment,
  onAddProperty,
  onEditProperty,
  onAddRoom
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Expanded properties accordion state
  const [expandedPropertyIds, setExpandedPropertyIds] = useState<Record<string, boolean>>({
    'prop-1': true // Expand first property by default
  });

  const toggleExpand = (propertyId: string) => {
    setExpandedPropertyIds(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  // Modals visibility state
  const [propModalOpen, setPropModalOpen] = useState(false);
  const [editPropModalOpen, setEditPropModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // Form states for Property Add/Edit
  const [propIdToEdit, setPropIdToEdit] = useState('');
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<'Kos' | 'Apartemen' | 'Kontrakan' | 'Ruko'>('Kos');
  const [propAddress, setPropAddress] = useState('');
  const [propRentType, setPropRentType] = useState<'Bulanan' | 'Tahunan' | 'Mingguan' | 'Harian'>('Bulanan');
  const [propPaymentTerms, setPropPaymentTerms] = useState<'Bayar di Depan' | 'Bayar di Belakang' | 'Jatuh Tempo H+5' | 'Jatuh Tempo H+10'>('Bayar di Depan');
  const [propStatus, setPropStatus] = useState<'Aktif' | 'Renovasi' | 'Nonaktif'>('Aktif');

  // Form states for Room Add
  const [activePropertyIdForRoom, setActivePropertyIdForRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomTenant, setRoomTenant] = useState('Kosong');
  const [roomPhone, setRoomPhone] = useState('-');
  const [roomAmount, setRoomAmount] = useState('');

  // Handle Property Submit
  const handleCreateProperty = () => {
    if (!propName.trim() || !propAddress.trim()) {
      alert('Mohon isi nama properti dan alamat lengkap!');
      return;
    }
    onAddProperty({
      name: propName,
      type: propType,
      address: propAddress,
      rentType: propRentType,
      paymentTerms: propPaymentTerms,
      status: propStatus
    });
    // Reset forms
    setPropName('');
    setPropAddress('');
    setPropModalOpen(false);
  };

  // Handle Property Edit Init
  const handleOpenEditPropModal = (property: Property) => {
    setPropIdToEdit(property.id);
    setPropName(property.name);
    setPropType(property.type);
    setPropAddress(property.address);
    setPropRentType(property.rentType);
    setPropPaymentTerms(property.paymentTerms);
    setPropStatus(property.status);
    setEditPropModalOpen(true);
  };

  // Handle Property Edit Save
  const handleSavePropertyEdit = () => {
    if (!propName.trim() || !propAddress.trim()) {
      alert('Mohon isi nama properti dan alamat lengkap!');
      return;
    }
    onEditProperty(propIdToEdit, {
      name: propName,
      type: propType,
      address: propAddress,
      rentType: propRentType,
      paymentTerms: propPaymentTerms,
      status: propStatus
    });
    setEditPropModalOpen(false);
  };

  // Handle Room Submit
  const handleCreateRoom = () => {
    if (!roomId.trim() || !roomType.trim() || !roomAmount.trim()) {
      alert('Mohon lengkapi nomor kamar, tipe kamar, dan biaya sewa!');
      return;
    }
    onAddRoom(activePropertyIdForRoom, {
      id: roomId,
      type: roomType,
      tenant: roomTenant,
      phone: roomPhone,
      amount: Number(roomAmount)
    });
    // Reset forms
    setRoomId('');
    setRoomType('');
    setRoomTenant('Kosong');
    setRoomPhone('-');
    setRoomAmount('');
    setRoomModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Kelola Properti
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Atur data properti sewa, kapasitas hunian, ketentuan sewa, dan unit kamar.
          </p>
        </div>
        <Button icon={<IconPlus />} onClick={() => setPropModalOpen(true)}>Tambah Properti</Button>
      </div>

      {/* Property Cards Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {properties.map(property => {
          const occupiedCount = property.rooms.filter(r => r.status !== 'neutral').length;
          const isExpanded = !!expandedPropertyIds[property.id];

          return (
            <div key={property.id} className="kf-fade-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Card elevation="surface" padding="md" radius="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Property Info Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '19px', margin: 0 }}>
                          {property.name}
                        </h2>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                          {property.type}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: property.status === 'Aktif' ? 'var(--color-success-bg)' : property.status === 'Renovasi' ? 'var(--color-warning-bg)' : 'var(--color-surface-low)', color: property.status === 'Aktif' ? 'var(--color-success)' : property.status === 'Renovasi' ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                          {property.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        📍 {property.address}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" size="sm" icon={<IconEdit />} onClick={() => handleOpenEditPropModal(property)}>
                        Setelan
                      </Button>
                      <Button variant="secondary" size="sm" icon={<IconPlus />} onClick={() => {
                        setActivePropertyIdForRoom(property.id);
                        setRoomModalOpen(true);
                      }}>
                        Kamar Baru
                      </Button>
                    </div>
                  </div>

                  {/* Settings tags summary */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-low)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <div>⏱️ Tipe Sewa: <strong>{property.rentType}</strong></div>
                    <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }} />
                    <div>💳 Ketentuan Bayar: <strong>{property.paymentTerms}</strong></div>
                    <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }} />
                    <div>🔑 Hunian: <strong>{occupiedCount} / {property.rooms.length} Kamar Terisi</strong></div>
                  </div>

                  {/* Accordion expand toggle */}
                  <button
                    onClick={() => toggleExpand(property.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderTop: '1px solid var(--color-border)'
                    }}
                  >
                    <span>{isExpanded ? 'Sembunyikan Daftar Kamar' : `Lihat Daftar Kamar (${property.rooms.length} Unit)`}</span>
                    <IconChevron expanded={isExpanded} />
                  </button>
                </div>
              </Card>

              {/* Nested Rooms Grid */}
              {isExpanded && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-surface-low)',
                  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                  marginTop: '-12px',
                  border: '1px solid var(--color-border)',
                  borderTop: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {property.rooms.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                      Belum ada kamar di properti ini. Klik tombol <strong>Kamar Baru</strong> di atas untuk menambahkan.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                      {property.rooms.map(room => (
                        <Card
                          key={`${property.id}-${room.id}`}
                          elevation="flat"
                          radius="md"
                          header={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span style={{ fontWeight: 800, fontSize: '14px' }}>Kamar {room.id}</span>
                              <StatusChip variant={room.status} label={room.label} />
                            </div>
                          }
                          footer={
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', width: '100%' }}>
                              {room.status !== 'neutral' && room.status !== 'success' && (
                                <Button variant="secondary" size="sm" onClick={() => onOpenPayment(property.id, room)}>
                                  Catat Bayar
                                </Button>
                              )}
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          }
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>Tipe:</span>
                              <span style={{ fontWeight: 600 }}>{room.type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>Penyewa:</span>
                              <span style={{ fontWeight: 600 }}>{room.tenant}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>Biaya Sewa:</span>
                              <span style={{ fontWeight: 700 }}>Rp {formatNumber(room.amount)}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrim Modal: Add Property */}
      <Modal
        isOpen={propModalOpen}
        onClose={() => setPropModalOpen(false)}
        title="Formulir Tambah Properti Baru"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setPropModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleCreateProperty}>Tambah Properti</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Nama Properti / Bangunan"
            value={propName}
            onChange={(e) => setPropName(e.target.value)}
            placeholder="Contoh: Kost Asri Condongcatur"
            required
          />

          <div className="kf-form-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Tipe Properti</label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Kos">Kos-kosan</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Kontrakan">Kontrakan Rumah</option>
                <option value="Ruko">Ruko / Toko</option>
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Status Properti</label>
              <select
                value={propStatus}
                onChange={(e) => setPropStatus(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Aktif">Aktif Operasional</option>
                <option value="Renovasi">Dalam Renovasi</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Alamat Lengkap</label>
            <textarea
              value={propAddress}
              onChange={(e) => setPropAddress(e.target.value)}
              placeholder="Contoh: Jl. Ringroad Utara No. 88, Sleman, Yogyakarta"
              rows={3}
              style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)', fontFamily: 'var(--font-body)', fontSize: '13px' }}
            />
          </div>

          <div className="kf-form-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Jangka Waktu Sewa</label>
              <select
                value={propRentType}
                onChange={(e) => setPropRentType(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Bulanan">Sewa Bulanan</option>
                <option value="Tahunan">Sewa Tahunan</option>
                <option value="Mingguan">Sewa Mingguan</option>
                <option value="Harian">Sewa Harian</option>
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Ketentuan Bayar</label>
              <select
                value={propPaymentTerms}
                onChange={(e) => setPropPaymentTerms(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Bayar di Depan">Bayar Di Depan (Awal)</option>
                <option value="Bayar di Belakang">Bayar Di Belakang (Akhir)</option>
                <option value="Jatuh Tempo H+5">Maks H+5 Setelah Tagihan</option>
                <option value="Jatuh Tempo H+10">Maks H+10 Setelah Tagihan</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Scrim Modal: Edit Property Settings */}
      <Modal
        isOpen={editPropModalOpen}
        onClose={() => setEditPropModalOpen(false)}
        title="Formulir Ubah Setelan Properti"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditPropModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSavePropertyEdit}>Simpan Setelan</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Nama Properti / Bangunan"
            value={propName}
            onChange={(e) => setPropName(e.target.value)}
            required
          />

          <div className="kf-form-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Tipe Properti</label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Kos">Kos-kosan</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Kontrakan">Kontrakan Rumah</option>
                <option value="Ruko">Ruko / Toko</option>
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Status Properti</label>
              <select
                value={propStatus}
                onChange={(e) => setPropStatus(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Aktif">Aktif Operasional</option>
                <option value="Renovasi">Dalam Renovasi</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Alamat Lengkap</label>
            <textarea
              value={propAddress}
              onChange={(e) => setPropAddress(e.target.value)}
              rows={3}
              style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)', fontFamily: 'var(--font-body)', fontSize: '13px' }}
            />
          </div>

          <div className="kf-form-row">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Jangka Waktu Sewa</label>
              <select
                value={propRentType}
                onChange={(e) => setPropRentType(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Bulanan">Sewa Bulanan</option>
                <option value="Tahunan">Sewa Tahunan</option>
                <option value="Mingguan">Sewa Mingguan</option>
                <option value="Harian">Sewa Harian</option>
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Ketentuan Bayar</label>
              <select
                value={propPaymentTerms}
                onChange={(e) => setPropPaymentTerms(e.target.value as any)}
                style={{ height: '40px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-lowest)' }}
              >
                <option value="Bayar di Depan">Bayar Di Depan (Awal)</option>
                <option value="Bayar di Belakang">Bayar Di Belakang (Akhir)</option>
                <option value="Jatuh Tempo H+5">Maks H+5 Setelah Tagihan</option>
                <option value="Jatuh Tempo H+10">Maks H+10 Setelah Tagihan</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Scrim Modal: Add Room */}
      <Modal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title="Formulir Tambah Unit Kamar Baru"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setRoomModalOpen(false)}>Batal</Button>
            <Button variant="secondary" onClick={handleCreateRoom}>Tambah Kamar</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Tambahkan nomor unit kamar baru ke properti <strong>{properties.find(p => p.id === activePropertyIdForRoom)?.name}</strong>.
          </p>

          <div className="kf-form-row">
            <div style={{ flex: 1 }}>
              <Input
                label="Nomor Kamar / Unit"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Contoh: 104, Unit C"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Tipe Kamar"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="Contoh: Kamar Deluxe"
                required
              />
            </div>
          </div>

          <div className="kf-form-row">
            <div style={{ flex: 1 }}>
              <Input
                label="Nama Penyewa Aktif"
                value={roomTenant}
                onChange={(e) => setRoomTenant(e.target.value)}
                hint="Tulis 'Kosong' jika belum disewa"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Nomor WhatsApp Penyewa"
                value={roomPhone}
                onChange={(e) => setRoomPhone(e.target.value)}
                hint="Tulis '-' jika belum disewa"
              />
            </div>
          </div>

          <Input
            label="Biaya Sewa Sewajarnya"
            value={roomAmount}
            onChange={(e) => setRoomAmount(e.target.value)}
            placeholder="Contoh: 2500000"
            icon={<span>Rp</span>}
            type="number"
            required
          />
        </div>
      </Modal>

    </div>
  );
};
