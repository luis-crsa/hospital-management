import { api } from './api';

export const doctorService = {
    // Listar todos os médicos
    async getAllDoctors() {
        const response = await api.get('/doctors');
        return response.data;
    },

    // Buscar médico por ID
    async getDoctorById(id) {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    // Buscar horários disponíveis de um médico
    async getAvailableHours(doctorId, date) {
        const response = await api.get(`/doctors/${doctorId}/available-hours`, {
            params: { date }
        });
        return response.data;
    }
}; 