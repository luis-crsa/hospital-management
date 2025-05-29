<template>
  <div class="appointment-list">
    <div class="header">
      <h1>Consultas</h1>
      <button @click="createAppointment" class="btn-create">Nova Consulta</button>
    </div>

    <div v-if="success" class="success">
      {{ success }}
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry" class="btn-retry">Tentar Novamente</button>
    </div>

    <div v-else>
      <div v-if="!appointments || appointments.length === 0" class="no-results">
        Nenhuma consulta encontrada.
      </div>
      <table v-else class="appointments-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>{{ formatDate(appointment.dateTime) }}</td>
            <td>{{ formatTime(appointment.dateTime) }}</td>
            <td>{{ appointment.patientId }}</td>
            <td>{{ appointment.doctorId }}</td>
            <td>
              <span :class="['status-badge', (appointment.status || 'SCHEDULED').toLowerCase()]">
                {{ formatStatus(appointment.status || 'SCHEDULED') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="btn-page"
        >
          Anterior
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="btn-page"
        >
          Próxima
        </button>
      </div>
    </div>

    <!-- Modal de Cancelamento -->
    <div v-if="showCancelModal" class="modal">
      <div class="modal-content">
        <h2>Cancelar Consulta</h2>
        <div class="form-group">
          <label for="cancelReason">Motivo do Cancelamento *</label>
          <textarea 
            id="cancelReason"
            v-model="cancelReason"
            rows="4"
            required
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="closeCancelModal" class="btn-cancel">Voltar</button>
          <button @click="confirmCancel" class="btn-confirm">Confirmar Cancelamento</button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="showDetailsModal" class="modal">
      <div class="modal-content">
        <h2>Detalhes da Consulta</h2>
        <div class="details-content">
          <div class="detail-group">
            <h3>Paciente</h3>
            <p><strong>Nome:</strong> {{ selectedAppointment?.patient.fullName }}</p>
            <p><strong>CPF:</strong> {{ formatCPF(selectedAppointment?.patient.cpf) }}</p>
          </div>
          <div class="detail-group">
            <h3>Médico</h3>
            <p><strong>Nome:</strong> {{ selectedAppointment?.doctor.name }}</p>
            <p><strong>Especialidade:</strong> {{ selectedAppointment?.doctor.specialty }}</p>
          </div>
          <div class="detail-group">
            <h3>Consulta</h3>
            <p><strong>Data:</strong> {{ formatDate(selectedAppointment?.date) }}</p>
            <p><strong>Horário:</strong> {{ formatTime(selectedAppointment?.time) }}</p>
            <p><strong>Status:</strong> {{ formatStatus(selectedAppointment?.status) }}</p>
          </div>
          <div v-if="selectedAppointment?.cancelReason" class="detail-group">
            <h3>Motivo do Cancelamento</h3>
            <p>{{ selectedAppointment.cancelReason }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeDetailsModal" class="btn-close">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { appointmentService } from '@/services/appointmentService';

export default {
  name: 'AppointmentList',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref(null);
    const appointments = ref([]);
    const searchTerm = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const showCancelModal = ref(false);
    const showDetailsModal = ref(false);
    const selectedAppointment = ref(null);
    const cancelReason = ref('');
    const success = ref(null);

    const filters = ref({
      startDate: '',
      endDate: '',
      status: ''
    });

    const loadAppointments = async () => {
      loading.value = true;
      error.value = null;

      try {
        console.log('Carregando consultas com parâmetros:', {
          page: currentPage.value - 1,
          search: searchTerm.value,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate,
          status: filters.value.status
        });

        const response = await appointmentService.getAppointments({
          page: currentPage.value - 1,
          search: searchTerm.value,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate,
          status: filters.value.status
        });

        console.log('Resposta da API:', response);

        if (Array.isArray(response)) {
          appointments.value = response;
          totalPages.value = 1;
        } else if (response && Array.isArray(response.content)) {
          appointments.value = response.content;
          totalPages.value = response.totalPages || 1;
        } else {
          console.error('Resposta inválida da API:', response);
          error.value = 'Formato de resposta inválido da API';
          appointments.value = [];
          totalPages.value = 1;
          return;
        }

        console.log('Consultas carregadas:', appointments.value);
      } catch (err) {
        console.error('Erro ao carregar consultas:', err);
        error.value = 'Erro ao carregar consultas. Por favor, tente novamente.';
        appointments.value = [];
        totalPages.value = 1;
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      currentPage.value = 1;
      loadAppointments();
    };

    const changePage = (page) => {
      currentPage.value = page;
      loadAppointments();
    };

    const createAppointment = () => {
      router.push('/appointments/new');
    };

    const cancelAppointment = (appointment) => {
      selectedAppointment.value = appointment;
      showCancelModal.value = true;
    };

    const confirmCancel = async () => {
      if (!cancelReason.value) {
        error.value = 'Por favor, informe o motivo do cancelamento';
        return;
      }

      try {
        loading.value = true;
        error.value = null;
        await appointmentService.cancelAppointment(
          selectedAppointment.value.id,
          cancelReason.value
        );
        success.value = 'Consulta cancelada com sucesso!';
        closeCancelModal();
        loadAppointments();
      } catch (err) {
        error.value = 'Erro ao cancelar consulta. Por favor, tente novamente.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const completeAppointment = async (appointment) => {
      try {
        loading.value = true;
        error.value = null;
        await appointmentService.completeAppointment(appointment.id);
        success.value = 'Consulta marcada como realizada!';
        loadAppointments();
      } catch (err) {
        error.value = 'Erro ao marcar consulta como realizada. Por favor, tente novamente.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const viewDetails = (appointment) => {
      selectedAppointment.value = appointment;
      showDetailsModal.value = true;
    };

    const closeCancelModal = () => {
      showCancelModal.value = false;
      selectedAppointment.value = null;
      cancelReason.value = '';
    };

    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedAppointment.value = null;
    };

    const retry = () => {
      error.value = null;
      loadAppointments();
    };

    const formatDate = (dateTime) => {
      return new Date(dateTime).toLocaleDateString('pt-BR');
    };

    const formatTime = (dateTime) => {
      return new Date(dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatStatus = (status) => {
      const statusMap = {
        'SCHEDULED': 'Agendada',
        'COMPLETED': 'Realizada',
        'CANCELLED': 'Cancelada'
      };
      return statusMap[status] || status;
    };

    const formatCPF = (cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    onMounted(() => {
      loadAppointments();
    });

    return {
      loading,
      error,
      appointments,
      searchTerm,
      filters,
      currentPage,
      totalPages,
      showCancelModal,
      showDetailsModal,
      selectedAppointment,
      cancelReason,
      success,
      handleSearch,
      changePage,
      createAppointment,
      cancelAppointment,
      confirmCancel,
      completeAppointment,
      viewDetails,
      closeCancelModal,
      closeDetailsModal,
      retry,
      formatDate,
      formatTime,
      formatStatus,
      formatCPF
    };
  }
};
</script>

<style scoped>
.appointment-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-create {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 300px;
}

.date-filter, .status-filter {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.appointments-table th,
.appointments-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.appointments-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-badge.scheduled {
  background-color: #2196F3;
  color: white;
}

.status-badge.completed {
  background-color: #4CAF50;
  color: white;
}

.status-badge.cancelled {
  background-color: #f44336;
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-cancel,
.btn-complete,
.btn-view {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-complete {
  background-color: #4CAF50;
  color: white;
}

.btn-view {
  background-color: #2196F3;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-page {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 500px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.details-content {
  margin: 20px 0;
}

.detail-group {
  margin-bottom: 20px;
}

.detail-group h3 {
  margin-bottom: 10px;
  color: #666;
}

.detail-group p {
  margin: 5px 0;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success {
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.btn-retry {
  background-color: #2196F3;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-retry:hover {
  opacity: 0.8;
}

button:hover {
  opacity: 0.8;
}
</style> 