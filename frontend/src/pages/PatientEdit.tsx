import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import PatientForm from '../components/PatientForm';
import { patientService } from '../services/patientService';
import { Patient, PatientFormData } from '../types/patient';

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);

  const loadPatient = async () => {
    try {
      if (id) {
        const data = await patientService.getById(parseInt(id));
        setPatient(data);
      }
    } catch (error) {
      console.error('Erro ao carregar paciente:', error);
    }
  };

  useEffect(() => {
    loadPatient();
  }, [id]);

  const handleSubmit = async (values: PatientFormData) => {
    try {
      if (id) {
        await patientService.update(parseInt(id), values);
        navigate(`/patients/${id}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
    }
  };

  if (!patient) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Paciente
        </Typography>
        <PatientForm
          initialValues={patient}
          onSubmit={handleSubmit}
          isEdit
        />
      </Paper>
    </Container>
  );
};

export default PatientEdit; 