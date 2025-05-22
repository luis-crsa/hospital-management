import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
}

// Dados mockados para exemplo
const pacientesMock: Paciente[] = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '123.456.789-00',
    telefone: '(91) 98765-4321',
    email: 'joao.silva@email.com',
    status: 'ativo',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    telefone: '(91) 91234-5678',
    email: 'maria.santos@email.com',
    status: 'ativo',
  },
];

export default function Pacientes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes] = useState<Paciente[]>(pacientesMock);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    navigate(`/pacientes/editar/${id}`);
  };

  const handleDelete = (id: number) => {
    // TODO: Implementar lógica de inativação
    console.log('Inativar paciente:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Pacientes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/pacientes/novo')}
        >
          Novo Paciente
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>{paciente.nome}</TableCell>
                    <TableCell>{paciente.cpf}</TableCell>
                    <TableCell>{paciente.telefone}</TableCell>
                    <TableCell>{paciente.email}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: paciente.status === 'ativo' ? 'success.main' : 'error.main',
                          textTransform: 'capitalize',
                        }}
                      >
                        {paciente.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(paciente.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(paciente.id)}
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
    </Box>
  );
} 