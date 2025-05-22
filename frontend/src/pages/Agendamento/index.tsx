import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

interface Consulta {
  id: number;
  paciente: string;
  medico: string;
  data: Date;
  horario: string;
  status: 'agendada' | 'cancelada' | 'realizada';
}

// Dados mockados para exemplo
const medicosMock = [
  { id: 1, nome: 'Dr. Carlos Silva', especialidade: 'Clínico Geral' },
  { id: 2, nome: 'Dra. Ana Santos', especialidade: 'Cardiologia' },
  { id: 3, nome: 'Dr. Pedro Oliveira', especialidade: 'Ortopedia' },
];

const consultasMock: Consulta[] = [
  {
    id: 1,
    paciente: 'João Silva',
    medico: 'Dr. Carlos Silva',
    data: new Date('2024-03-20'),
    horario: '09:00',
    status: 'agendada',
  },
  {
    id: 2,
    paciente: 'Maria Santos',
    medico: 'Dra. Ana Santos',
    data: new Date('2024-03-21'),
    horario: '14:30',
    status: 'agendada',
  },
];

export default function Agendamento() {
  const [openDialog, setOpenDialog] = useState(false);
  const [consultas] = useState<Consulta[]>(consultasMock);
  const [formData, setFormData] = useState({
    paciente: '',
    medico: '',
    data: null as Date | null,
    horario: null as Date | null,
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      paciente: '',
      medico: '',
      data: null,
      horario: null,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implementar lógica de agendamento
    console.log('Dados do agendamento:', formData);
    handleCloseDialog();
  };

  const handleCancelarConsulta = (id: number) => {
    // TODO: Implementar lógica de cancelamento
    console.log('Cancelar consulta:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Agendamentos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Novo Agendamento
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Médico</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultas.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{consulta.paciente}</TableCell>
                    <TableCell>{consulta.medico}</TableCell>
                    <TableCell>
                      {consulta.data.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{consulta.horario}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: consulta.status === 'agendada' ? 'success.main' : 'error.main',
                          textTransform: 'capitalize',
                        }}
                      >
                        {consulta.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleCancelarConsulta(consulta.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Paciente"
                  value={formData.paciente}
                  onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Médico"
                  value={formData.medico}
                  onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                >
                  {medicosMock.map((medico) => (
                    <MenuItem key={medico.id} value={medico.nome}>
                      {medico.nome} - {medico.especialidade}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Data"
                    value={formData.data}
                    onChange={(date) => setFormData({ ...formData, data: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <TimePicker
                    label="Horário"
                    value={formData.horario}
                    onChange={(time) => setFormData({ ...formData, horario: time })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Agendar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 