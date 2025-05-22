import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

interface FormData {
  nome: string;
  dataNascimento: Date | null;
  cpf: string;
  sexo: string;
  telefone: string;
  endereco: string;
  email: string;
  tipoSanguineo: string;
  alergias: string;
}

const tiposSanguineos = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export default function NovoPaciente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    dataNascimento: null,
    cpf: '',
    sexo: '',
    telefone: '',
    endereco: '',
    email: '',
    tipoSanguineo: '',
    alergias: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dataNascimento: date,
    });
  };

  const validateForm = () => {
    if (!formData.nome || !formData.cpf || !formData.sexo || !formData.telefone || !formData.endereco) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    // Validação básica de CPF (11 dígitos)
    if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      setError('CPF inválido. Digite apenas números.');
      return false;
    }
    // Validação básica de email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implementar chamada à API
      console.log('Dados do formulário:', formData);
      navigate('/pacientes');
    } catch (err) {
      setError('Erro ao cadastrar paciente. Tente novamente.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Novo Paciente
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={handleChange('nome')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Data de Nascimento"
                    value={formData.dataNascimento}
                    onChange={handleDateChange}
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
                <TextField
                  required
                  fullWidth
                  label="CPF"
                  value={formData.cpf}
                  onChange={handleChange('cpf')}
                  placeholder="00000000000"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Sexo"
                  value={formData.sexo}
                  onChange={handleChange('sexo')}
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Feminino</MenuItem>
                  <MenuItem value="O">Outro</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={handleChange('telefone')}
                  placeholder="(00) 00000-0000"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Endereço"
                  value={formData.endereco}
                  onChange={handleChange('endereco')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo Sanguíneo"
                  value={formData.tipoSanguineo}
                  onChange={handleChange('tipoSanguineo')}
                >
                  {tiposSanguineos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alergias Conhecidas"
                  value={formData.alergias}
                  onChange={handleChange('alergias')}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/pacientes')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Cadastrar Paciente
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 