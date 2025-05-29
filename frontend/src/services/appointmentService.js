import { api } from '@/services/api';

export const appointmentService = {
    // Listar consultas de um paciente
    async getPatientAppointments(patientId) {
        const response = await api.get(`/appointments/patient/${patientId}`);
        return response.data;
    },

    // Listar consultas de um médico
    async getDoctorAppointments(doctorId) {
        const response = await api.get(`/appointments/doctor/${doctorId}`);
        return response.data;
    },

    // Verificar disponibilidade de horário
    async checkAvailability(doctorId, date, time) {
        const response = await api.get(`/appointments/check-availability`, {
            params: { doctorId, date, time }
        });
        return response.data;
    },

    // Criar novo agendamento
    async createAppointment(appointment) {
        const response = await api.post('/appointments', appointment);
        return response.data;
    },

    // Cancelar agendamento
    async cancelAppointment(id, reason) {
        const response = await api.post(`/appointments/${id}/cancel`, { reason });
        return response.data;
    },

    async completeAppointment(id) {
        const response = await api.post(`/appointments/${id}/complete`);
        return response.data;
    },

    async getAppointments({ page = 0, search = '', startDate = '', endDate = '', status = '' }) {
        const params = new URLSearchParams({
            page,
            size: 10,
            search,
            startDate,
            endDate,
            status
        });

        const response = await api.get(`/appointments?${params}`);
        return response.data;
    }
}; 