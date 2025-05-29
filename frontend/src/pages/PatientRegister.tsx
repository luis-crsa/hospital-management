import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import { patientService } from '../services/patientService';
import { PatientFormData } from '../types/patient';

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: PatientFormData) => {
    try {
      await patientService.create(values);
      navigate('/patients');
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      // Aqui você pode adicionar uma notificação de erro
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Paciente
        </Typography>
        <PatientForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
};

export default PatientRegister; 