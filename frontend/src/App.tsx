import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import NovoPaciente from './pages/Pacientes/NovoPaciente';
import ConsultarPaciente from './pages/Pacientes/ConsultarPaciente';
import EditarPaciente from './pages/Pacientes/EditarPaciente';
import Agendamento from './pages/Agendamento';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/novo" element={<NovoPaciente />} />
            <Route path="/pacientes/consultar" element={<ConsultarPaciente />} />
            <Route path="/pacientes/editar/:id" element={<EditarPaciente />} />
            <Route path="/agendamento" element={<Agendamento />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
