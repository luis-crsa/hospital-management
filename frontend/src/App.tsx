import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PatientList from './pages/PatientList';
import PatientRegister from './pages/PatientRegister';
import PatientDetails from './pages/PatientDetails';
import PatientEdit from './pages/PatientEdit';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientRegister />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/edit" element={<PatientEdit />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
