import api from './api';
import { Patient, PatientFormData } from '../types/patient';

export const patientService = {
  create: async (data: PatientFormData): Promise<Patient> => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  inactivate: async (id: number, reason: string): Promise<Patient> => {
    const response = await api.patch<Patient>(`/patients/${id}/inactivate`, { reason });
    return response.data;
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await api.get<Patient[]>(`/patients/search?q=${query}`);
    return response.data;
  }
}; 