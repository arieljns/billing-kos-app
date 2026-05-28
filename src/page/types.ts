export interface Room {
  id: string;
  type: string;
  tenant: string;
  phone: string;
  amount: number;
  status: 'success' | 'error' | 'warning' | 'neutral';
  label: string;
  period: number; // sewa progress %
  due: string;
}

export interface Property {
  id: string;
  name: string;
  type: 'Kos' | 'Apartemen' | 'Kontrakan' | 'Ruko';
  address: string;
  rentType: 'Bulanan' | 'Tahunan' | 'Mingguan' | 'Harian';
  paymentTerms: 'Bayar di Depan' | 'Bayar di Belakang' | 'Jatuh Tempo H+5' | 'Jatuh Tempo H+10';
  status: 'Aktif' | 'Renovasi' | 'Nonaktif';
  rooms: Room[];
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  room: string;
  tenant: string;
  amount: string;
  date: string;
  method: string;
  status: 'success' | 'error' | 'warning' | 'neutral';
  label: string;
}

