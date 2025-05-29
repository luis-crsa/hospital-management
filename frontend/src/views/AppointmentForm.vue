<template>
  <div class="appointment-form">
    <h1>Agendar Consulta</h1>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry" class="btn-retry">Tentar Novamente</button>
    </div>

    <div v-if="success" class="success">
      {{ success }}
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <div class="form-section">
        <h2>Paciente</h2>
        
        <div class="form-group">
          <label for="patientSearch">Buscar Paciente *</label>
          <div class="search-container">
            <input 
              type="text" 
              id="patientSearch" 
              v-model="patientSearch"
              placeholder="Digite nome ou CPF do paciente"
              @input="searchPatient"
              :class="{ 'error': errors.patientId }"
            >
            <div v-if="showPatientResults" class="search-results">
              <div 
                v-for="patient in patientResults" 
                :key="patient.id"
                class="search-result-item"
                @click="selectPatient(patient)"
              >
                <span>{{ patient.fullName }}</span>
                <span class="cpf">{{ formatCPF(patient.cpf) }}</span>
              </div>
            </div>
          </div>
          <span class="error-message" v-if="errors.patientId">{{ errors.patientId }}</span>
        </div>

        <div v-if="selectedPatient" class="selected-patient">
          <h3>Paciente Selecionado</h3>
          <p><strong>Nome:</strong> {{ selectedPatient.fullName }}</p>
          <p><strong>CPF:</strong> {{ formatCPF(selectedPatient.cpf) }}</p>
        </div>
      </div>

      <div class="form-section">
        <h2>Médico e Horário</h2>

        <div class="form-group">
          <label for="doctor">Médico *</label>
          <select 
            id="doctor" 
            v-model="form.doctorId"
            :class="{ 'error': errors.doctorId }"
            required
            @change="loadAvailableHours"
          >
            <option value="">Selecione um médico</option>
            <option 
              v-for="doctor in doctors" 
              :key="doctor.id" 
              :value="doctor.id"
            >
              {{ doctor.name }} - {{ doctor.specialty }}
            </option>
          </select>
          <span class="error-message" v-if="errors.doctorId">{{ errors.doctorId }}</span>
        </div>

        <div class="form-group">
          <label for="date">Data *</label>
          <input 
            type="date" 
            id="date" 
            v-model="form.date"
            :min="minDate"
            :class="{ 'error': errors.date }"
            required
            @change="loadAvailableHours"
          >
          <span class="error-message" v-if="errors.date">{{ errors.date }}</span>
        </div>

        <div class="form-group">
          <label for="time">Horário *</label>
          <select 
            id="time" 
            v-model="form.time"
            :class="{ 'error': errors.time }"
            required
            :disabled="!availableHours.length"
          >
            <option value="">Selecione um horário</option>
            <option 
              v-for="hour in availableHours" 
              :key="hour"
              :value="hour"
            >
              {{ formatTime(hour) }}
            </option>
          </select>
          <span class="error-message" v-if="errors.time">{{ errors.time }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="btn-cancel">Cancelar</button>
        <button type="submit" class="btn-submit">Agendar Consulta</button>
      </div>
    </form>

    <div v-if="showConfirmationModal" class="modal">
      <div class="modal-content">
        <h2>Confirmar Agendamento</h2>
        <div class="confirmation-details">
          <p><strong>Paciente:</strong> {{ selectedPatient?.fullName }}</p>
          <p><strong>Médico:</strong> {{ selectedDoctor?.name }}</p>
          <p><strong>Data:</strong> {{ formatDate(form.date) }}</p>
          <p><strong>Horário:</strong> {{ formatTime(form.time) }}</p>
        </div>
        <div class="modal-actions">
          <button @click="cancelConfirmation" class="btn-cancel">Cancelar</button>
          <button @click="confirmAppointment" class="btn-confirm">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';

export default {
  name: 'AppointmentForm',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref(null);
    const success = ref(null);
    const doctors = ref([]);
    const patientSearch = ref('');
    const patientResults = ref([]);
    const showPatientResults = ref(false);
    const selectedPatient = ref(null);
    const availableHours = ref([]);
    const showConfirmationModal = ref(false);

    const form = ref({
      patientId: '',
      doctorId: '',
      date: '',
      time: ''
    });

    const errors = ref({});

    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });

    const selectedDoctor = computed(() => {
      return doctors.value.find(d => d.id === form.value.doctorId);
    });

    const searchPatient = async () => {
      if (patientSearch.value.length < 3) {
        patientResults.value = [];
        showPatientResults.value = false;
        return;
      }

      try {
        loading.value = true;
        error.value = null;
        const results = await patientService.search(patientSearch.value);
        patientResults.value = results;
        showPatientResults.value = true;
      } catch (err) {
        error.value = 'Erro ao buscar pacientes. Por favor, tente novamente.';
        console.error('Erro ao buscar pacientes:', err);
      } finally {
        loading.value = false;
      }
    };

    const selectPatient = (patient) => {
      selectedPatient.value = patient;
      form.value.patientId = patient.id;
      patientSearch.value = patient.fullName;
      showPatientResults.value = false;
    };

    const loadDoctors = async () => {
      try {
        loading.value = true;
        error.value = null;
        doctors.value = await doctorService.getAllDoctors();
      } catch (err) {
        error.value = 'Erro ao carregar médicos. Por favor, tente novamente.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const loadAvailableHours = async () => {
      if (!form.value.doctorId || !form.value.date) return;

      try {
        loading.value = true;
        error.value = null;
        availableHours.value = await doctorService.getAvailableHours(
          form.value.doctorId,
          form.value.date
        );
      } catch (err) {
        error.value = 'Erro ao carregar horários. Por favor, tente novamente.';
        console.error('Erro ao carregar horários:', err);
      } finally {
        loading.value = false;
      }
    };

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.patientId) {
        errors.value.patientId = 'Selecione um paciente';
        isValid = false;
      }

      if (!form.value.doctorId) {
        errors.value.doctorId = 'Selecione um médico';
        isValid = false;
      }

      if (!form.value.date) {
        errors.value.date = 'Selecione uma data';
        isValid = false;
      }

      if (!form.value.time) {
        errors.value.time = 'Selecione um horário';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (!validateForm()) return;
      showConfirmationModal.value = true;
    };

    const confirmAppointment = async () => {
      try {
        loading.value = true;
        error.value = null;
        await appointmentService.createAppointment({
          patientId: form.value.patientId,
          doctorId: form.value.doctorId,
          date: form.value.date,
          time: form.value.time
        });
        success.value = 'Consulta agendada com sucesso!';
        setTimeout(() => {
          router.push('/appointments');
        }, 2000);
      } catch (err) {
        error.value = err.response?.data?.message || 'Erro ao agendar consulta. Por favor, tente novamente.';
        console.error('Erro ao agendar consulta:', err);
      } finally {
        loading.value = false;
        showConfirmationModal.value = false;
      }
    };

    const cancel = () => {
      router.push('/appointments');
    };

    const cancelConfirmation = () => {
      showConfirmationModal.value = false;
    };

    const retry = () => {
      error.value = null;
      loadDoctors();
    };

    const formatCPF = (cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatTime = (time) => {
      return time;
    };

    onMounted(() => {
      loadDoctors();
    });

    return {
      loading,
      error,
      success,
      doctors,
      patientSearch,
      patientResults,
      showPatientResults,
      selectedPatient,
      availableHours,
      form,
      errors,
      minDate,
      selectedDoctor,
      showConfirmationModal,
      searchPatient,
      selectPatient,
      loadAvailableHours,
      handleSubmit,
      confirmAppointment,
      cancel,
      cancelConfirmation,
      formatCPF,
      formatDate,
      formatTime,
      retry
    };
  }
};
</script>

<style scoped>
.appointment-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input.error, select.error {
  border-color: #ff0000;
}

.error-message {
  color: #ff0000;
  font-size: 0.8em;
  margin-top: 5px;
}

.search-container {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  padding: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.selected-patient {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.confirmation-details {
  margin: 20px 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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