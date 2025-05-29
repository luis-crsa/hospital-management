export interface Patient {
  id?: number;
  name: string;
  birthDate: string;
  cpf: string;
  gender: string;
  phone: string;
  address: string;
  email?: string;
  bloodType?: string;
  allergies?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormData extends Omit<Patient, 'id' | 'createdAt' | 'updatedAt'> {} 