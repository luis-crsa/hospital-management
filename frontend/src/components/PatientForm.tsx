import React from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { PatientFormData } from '../types/patient';

interface PatientFormProps {
  initialValues?: Partial<PatientFormData>;
  onSubmit: (values: PatientFormData) => void;
  isEdit?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialValues, onSubmit, isEdit = false }) => {
  const formik = useFormik<PatientFormData>({
    initialValues: {
      name: '',
      birthDate: '',
      cpf: '',
      gender: '',
      phone: '',
      address: '',
      email: '',
      bloodType: '',
      allergies: '',
      ...initialValues
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Nome Completo"
            value={formik.values.name}
            onChange={formik.handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="birthDate"
            name="birthDate"
            label="Data de Nascimento"
            type="date"
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="cpf"
            name="cpf"
            label="CPF"
            value={formik.values.cpf}
            onChange={formik.handleChange}
            required
            disabled={isEdit}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="gender"
            name="gender"
            select
            label="Sexo"
            value={formik.values.gender}
            onChange={formik.handleChange}
            required
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
            <MenuItem value="O">Outro</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Telefone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Endereço"
            value={formik.values.address}
            onChange={formik.handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="bloodType"
            name="bloodType"
            select
            label="Tipo Sanguíneo"
            value={formik.values.bloodType}
            onChange={formik.handleChange}
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="allergies"
            name="allergies"
            label="Alergias"
            multiline
            rows={2}
            value={formik.values.allergies}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {isEdit ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PatientForm; 