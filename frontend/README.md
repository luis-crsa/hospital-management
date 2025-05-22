# Sistema de Gestão Hospitalar - Frontend

Este é o frontend do Sistema de Gestão Hospitalar desenvolvido para o Hospital CESUPA. O sistema foi construído utilizando React com TypeScript e Material-UI para uma interface moderna e responsiva.

## Funcionalidades

- Dashboard com estatísticas e próximas consultas
- Cadastro e gerenciamento de pacientes
- Agendamento de consultas
- Consulta de dados de pacientes
- Atualização de cadastros
- Inativação de cadastros

## Tecnologias Utilizadas

- React 18
- TypeScript
- Material-UI (MUI)
- React Router DOM
- Vite
- ESLint
- date-fns

## Pré-requisitos

- Node.js 16.x ou superior
- npm 7.x ou superior

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd hospital-management/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza a versão de produção localmente

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── theme.ts       # Configuração do tema
  ├── App.tsx        # Componente principal
  └── main.tsx       # Ponto de entrada
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
