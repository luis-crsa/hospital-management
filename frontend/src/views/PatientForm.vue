<template>
  <div class="patient-form">
    <h1>{{ isEditing ? 'Editar Paciente' : 'Novo Paciente' }}</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Dados Obrigatórios -->
      <div class="form-section">
        <h2>Dados Obrigatórios</h2>
        
        <div class="form-group">
          <label for="fullName">Nome Completo *</label>
          <input 
            type="text" 
            id="fullName" 
            v-model="form.fullName"
            :class="{ 'error': errors.fullName }"
            required
          >
          <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
        </div>

        <div class="form-group">
          <label for="birthDate">Data de Nascimento *</label>
          <input 
            type="date" 
            id="birthDate" 
            v-model="form.birthDate"
            :class="{ 'error': errors.birthDate }"
            required
          >
          <span class="error-message" v-if="errors.birthDate">{{ errors.birthDate }}</span>
        </div>

        <div class="form-group">
          <label for="cpf">CPF *</label>
          <input 
            type="text" 
            id="cpf" 
            v-model="form.cpf"
            :class="{ 'error': errors.cpf }"
            :disabled="isEditing"
            required
          >
          <span class="error-message" v-if="errors.cpf">{{ errors.cpf }}</span>
        </div>

        <div class="form-group">
          <label for="gender">Sexo *</label>
          <select 
            id="gender" 
            v-model="form.gender"
            :class="{ 'error': errors.gender }"
            required
          >
            <option value="">Selecione</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
            <option value="OTHER">Outro</option>
          </select>
          <span class="error-message" v-if="errors.gender">{{ errors.gender }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Telefone *</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone"
            :class="{ 'error': errors.phone }"
            required
          >
          <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="address">Endereço *</label>
          <input 
            type="text" 
            id="address" 
            v-model="form.address"
            :class="{ 'error': errors.address }"
            required
          >
          <span class="error-message" v-if="errors.address">{{ errors.address }}</span>
        </div>
      </div>

      <!-- Dados Complementares -->
      <div class="form-section">
        <h2>Dados Complementares</h2>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            :class="{ 'error': errors.email }"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="bloodType">Tipo Sanguíneo</label>
          <select 
            id="bloodType" 
            v-model="form.bloodType"
            :class="{ 'error': errors.bloodType }"
          >
            <option value="">Selecione</option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>
          <span class="error-message" v-if="errors.bloodType">{{ errors.bloodType }}</span>
        </div>

        <div class="form-group">
          <label for="knownAllergies">Alergias Conhecidas</label>
          <textarea 
            id="knownAllergies" 
            v-model="form.knownAllergies"
            :class="{ 'error': errors.knownAllergies }"
          ></textarea>
          <span class="error-message" v-if="errors.knownAllergies">{{ errors.knownAllergies }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="btn-cancel">Cancelar</button>
        <button type="submit" class="btn-submit">{{ isEditing ? 'Atualizar' : 'Cadastrar' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { patientService } from '@/services/patientService';

export default {
  name: 'PatientForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isEditing = ref(false);
    const errors = ref({});

    const form = ref({
      fullName: '',
      birthDate: '',
      cpf: '',
      gender: '',
      phone: '',
      address: '',
      email: '',
      bloodType: '',
      knownAllergies: ''
    });

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      // Validação de CPF
      if (!isEditing.value && !validateCPF(form.value.cpf)) {
        errors.value.cpf = 'CPF inválido';
        isValid = false;
      }

      // Validação de email
      if (form.value.email && !validateEmail(form.value.email)) {
        errors.value.email = 'Email inválido';
        isValid = false;
      }

      // Validação de telefone
      if (!validatePhone(form.value.phone)) {
        errors.value.phone = 'Telefone inválido';
        isValid = false;
      }

      return isValid;
    };

    const validateCPF = (cpf) => {
      cpf = cpf.replace(/[^\d]/g, '');
      if (cpf.length !== 11) return false;

      // Implementar validação de dígitos verificadores
      return true;
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validatePhone = (phone) => {
      const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return re.test(phone);
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        if (isEditing.value) {
          await patientService.updatePatient(route.params.id, form.value);
        } else {
          await patientService.createPatient(form.value);
        }
        router.push('/patients');
      } catch (error) {
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Erro ao salvar paciente');
        }
      }
    };

    const cancel = () => {
      router.push('/patients');
    };

    const loadPatient = async (id) => {
      try {
        const patient = await patientService.getPatientById(id);
        form.value = { ...patient };
      } catch (error) {
        alert('Erro ao carregar paciente');
        router.push('/patients');
      }
    };

    onMounted(() => {
      if (route.params.id) {
        isEditing.value = true;
        loadPatient(route.params.id);
      }
    });

    return {
      form,
      errors,
      isEditing,
      handleSubmit,
      cancel
    };
  }
};
</script>

<style scoped>
.patient-form {
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

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input.error, select.error, textarea.error {
  border-color: #ff0000;
}

.error-message {
  color: #ff0000;
  font-size: 0.8em;
  margin-top: 5px;
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

button:hover {
  opacity: 0.8;
}
</style> 