import { api } from './api';

export const patientService = {
    // Listar todos os pacientes
    async getAllPatients(page = 0, size = 10) {
        const response = await api.get(`/patients?page=${page}&size=${size}`);
        return response.data;
    },

    // Buscar paciente por ID
    async getPatientById(id) {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    // Criar novo paciente
    async createPatient(patient) {
        const response = await api.post('/patients', patient);
        return response.data;
    },

    // Atualizar paciente
    async updatePatient(id, patient) {
        const response = await api.put(`/patients/${id}`, patient);
        return response.data;
    },

    // Deletar paciente
    async deletePatient(id) {
        await api.delete(`/patients/${id}`);
    },

    // Buscar pacientes por nome ou CPF
    async search(term) {
        const response = await api.get('/patients/search', {
            params: { term }
        });
        return response.data;
    }
}; 