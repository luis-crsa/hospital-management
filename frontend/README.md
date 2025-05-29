# Sistema de Gestão Hospitalar - Frontend

Este é o frontend do Sistema de Gestão Hospitalar, desenvolvido com React, TypeScript e Vite.

## Funcionalidades

- Cadastro de pacientes
- Listagem de pacientes
- Visualização detalhada de pacientes
- Edição de dados de pacientes
- Inativação de cadastros de pacientes
- Busca de pacientes por nome, CPF ou ID

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Material-UI
- React Router
- Axios
- Formik

## Requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior

## Instalação

1. Clone o repositório
2. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse a aplicação em `http://localhost:5173`

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços de API
  ├── types/         # Definições de tipos TypeScript
  └── App.tsx        # Componente principal
```

## API

O frontend se comunica com o backend através da API REST. As principais rotas são:

- `GET /patients` - Lista todos os pacientes
- `POST /patients` - Cria um novo paciente
- `GET /patients/:id` - Obtém detalhes de um paciente
- `PUT /patients/:id` - Atualiza dados de um paciente
- `PATCH /patients/:id/inactivate` - Inativa um paciente
- `GET /patients/search` - Busca pacientes por termo
