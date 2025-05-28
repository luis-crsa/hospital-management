import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { patientService } from '../services/patientService';
import { Patient } from '../types/patient';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [inactivationReason, setInactivationReason] = useState('');

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

  const handleInactivate = async () => {
    if (!patient || !inactivationReason) return;

    try {
      await patientService.inactivate(patient.id!, inactivationReason);
      setOpenDialog(false);
      loadPatient();
    } catch (error) {
      console.error('Erro ao inativar paciente:', error);
    }
  };

  if (!patient) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Detalhes do Paciente
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Nome</Typography>
            <Typography>{patient.name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">CPF</Typography>
            <Typography>{patient.cpf}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Data de Nascimento</Typography>
            <Typography>{new Date(patient.birthDate).toLocaleDateString()}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Sexo</Typography>
            <Typography>
              {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Feminino' : 'Outro'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Telefone</Typography>
            <Typography>{patient.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email</Typography>
            <Typography>{patient.email || 'Não informado'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Endereço</Typography>
            <Typography>{patient.address}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Tipo Sanguíneo</Typography>
            <Typography>{patient.bloodType || 'Não informado'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Alergias</Typography>
            <Typography>{patient.allergies || 'Nenhuma alergia registrada'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Status</Typography>
            <Typography>{patient.status === 'active' ? 'Ativo' : 'Inativo'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/patients/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            {patient.status === 'active' && (
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialog(true)}
              >
                Inativar
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Inativar Paciente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo da Inativação"
            fullWidth
            multiline
            rows={4}
            value={inactivationReason}
            onChange={(e) => setInactivationReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleInactivate} color="error">
            Confirmar Inativação
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDetails; 