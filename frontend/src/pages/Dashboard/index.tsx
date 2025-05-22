import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Dados mockados para exemplo
const estatisticas = {
  totalPacientes: 150,
  consultasHoje: 12,
  consultasPendentes: 5,
  consultasRealizadas: 7,
};

const proximasConsultas = [
  {
    id: 1,
    paciente: 'João Silva',
    medico: 'Dr. Carlos Silva',
    horario: '09:00',
    especialidade: 'Clínico Geral',
  },
  {
    id: 2,
    paciente: 'Maria Santos',
    medico: 'Dra. Ana Santos',
    horario: '10:30',
    especialidade: 'Cardiologia',
  },
  {
    id: 3,
    paciente: 'Pedro Oliveira',
    medico: 'Dr. Pedro Oliveira',
    horario: '14:00',
    especialidade: 'Ortopedia',
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de Estatísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total de Pacientes</Typography>
              </Box>
              <Typography variant="h4">{estatisticas.totalPacientes}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Consultas Hoje</Typography>
              </Box>
              <Typography variant="h4">{estatisticas.consultasHoje}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pendentes</Typography>
              </Box>
              <Typography variant="h4">{estatisticas.consultasPendentes}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Realizadas</Typography>
              </Box>
              <Typography variant="h4">{estatisticas.consultasRealizadas}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Próximas Consultas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Consultas
              </Typography>
              <List>
                {proximasConsultas.map((consulta, index) => (
                  <Box key={consulta.id}>
                    <ListItem>
                      <ListItemIcon>
                        <EventNoteIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${consulta.paciente} - ${consulta.especialidade}`}
                        secondary={`${consulta.medico} - ${consulta.horario}`}
                      />
                    </ListItem>
                    {index < proximasConsultas.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 