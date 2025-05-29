<template>
  <div class="patient-list">
    <h1>Lista de Pacientes</h1>
    
    <div class="search-section">
      <div class="search-input">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar por nome, CPF ou ID"
          @input="handleSearch"
        >
      </div>
      <button @click="openNewPatientForm" class="btn-primary">Novo Paciente</button>
    </div>

    <div v-if="loading" class="loading">
      Carregando...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <table v-if="patients.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.id }}</td>
            <td>{{ patient.fullName }}</td>
            <td>{{ formatCPF(patient.cpf) }}</td>
            <td>{{ formatDate(patient.birthDate) }}</td>
            <td>
              <span :class="['status', patient.active ? 'active' : 'inactive']">
                {{ patient.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions">
              <button @click="viewPatient(patient)" class="btn-view">Visualizar</button>
              <button @click="editPatient(patient)" class="btn-edit">Editar</button>
              <button 
                v-if="patient.active" 
                @click="confirmInactivate(patient)" 
                class="btn-inactivate"
              >
                Inativar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-results">Nenhum paciente encontrado.</p>

      <!-- Paginação -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 0" 
          @click="changePage(currentPage - 1)"
          class="btn-page"
        >
          Anterior
        </button>
        <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages - 1" 
          @click="changePage(currentPage + 1)"
          class="btn-page"
        >
          Próxima
        </button>
      </div>
    </div>

    <!-- Modal de Inativação -->
    <div v-if="showInactivateModal" class="modal">
      <div class="modal-content">
        <h2>Confirmar Inativação</h2>
        <p>Tem certeza que deseja inativar o paciente {{ selectedPatient?.fullName }}?</p>
        <div class="form-group">
          <label for="inactivationReason">Motivo da Inativação:</label>
          <textarea 
            id="inactivationReason" 
            v-model="inactivationReason"
            required
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="cancelInactivate" class="btn-cancel">Cancelar</button>
          <button @click="confirmInactivateAction" class="btn-confirm">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { patientService } from '@/services/patientService';

export default {
  name: 'PatientList',
  setup() {
    const router = useRouter();
    const patients = ref([]);
    const currentPage = ref(0);
    const pageSize = ref(10);
    const totalPages = ref(0);
    const searchTerm = ref('');
    const loading = ref(false);
    const error = ref(null);
    const showInactivateModal = ref(false);
    const selectedPatient = ref(null);
    const inactivationReason = ref('');

    const loadPatients = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await patientService.getAllPatients(currentPage.value, pageSize.value);
        patients.value = response.content;
        totalPages.value = response.totalPages;
      } catch (err) {
        error.value = 'Erro ao carregar pacientes';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = async () => {
      if (searchTerm.value.length >= 3) {
        currentPage.value = 0;
        await loadPatients();
      } else if (searchTerm.value.length === 0) {
        await loadPatients();
      }
    };

    const changePage = async (page) => {
      currentPage.value = page;
      await loadPatients();
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCPF = (cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const viewPatient = (patient) => {
      router.push(`/patients/${patient.id}`);
    };

    const editPatient = (patient) => {
      router.push(`/patients/${patient.id}/edit`);
    };

    const openNewPatientForm = () => {
      router.push('/patients/new');
    };

    const confirmInactivate = (patient) => {
      selectedPatient.value = patient;
      showInactivateModal.value = true;
    };

    const cancelInactivate = () => {
      showInactivateModal.value = false;
      selectedPatient.value = null;
      inactivationReason.value = '';
    };

    const confirmInactivateAction = async () => {
      if (!inactivationReason.value) {
        alert('Por favor, informe o motivo da inativação');
        return;
      }

      try {
        await patientService.deletePatient(selectedPatient.value.id);
        await loadPatients();
        showInactivateModal.value = false;
        selectedPatient.value = null;
        inactivationReason.value = '';
      } catch (err) {
        alert('Erro ao inativar paciente');
        console.error(err);
      }
    };

    onMounted(() => {
      loadPatients();
    });

    return {
      patients,
      currentPage,
      totalPages,
      searchTerm,
      loading,
      error,
      showInactivateModal,
      selectedPatient,
      inactivationReason,
      handleSearch,
      changePage,
      formatDate,
      formatCPF,
      viewPatient,
      editPatient,
      openNewPatientForm,
      confirmInactivate,
      cancelInactivate,
      confirmInactivateAction
    };
  }
};
</script>

<style scoped>
.patient-list {
  padding: 20px;
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  margin-right: 20px;
}

.search-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status.active {
  background-color: #4CAF50;
  color: white;
}

.status.inactive {
  background-color: #f44336;
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view {
  background-color: #2196F3;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #FF9800;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-inactivate {
  background-color: #f44336;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  color: #f44336;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

button:hover {
  opacity: 0.8;
}
</style> 