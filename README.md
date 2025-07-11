# KOR FBB

Training, movement, and user management system for gyms, developed with Next.js, MongoDB, and custom authentication

## Sumário

- [Overview](#visão-geral)
- [Features](#funcionalidades)
- [Technologies Used](#tecnologias-utilizadas)
- [Installation](#instalação)
- [Configuration](#configuração)
- [Available Scripts](#scripts-disponíveis)
- [Folder Structures](#estrutura-de-pastas)
- [How to Contribute](#como-contribuir)
- [License](#licença)

---

## Overview

This project enables management of workouts, movements, users, and sessions with role-based authentication and authorization (admin/user). It’s aimed at gyms and trainers who want to organize training programs, track progress, and control access.

## Features

- Create, edit, and delete workouts by program, week, and day
- Users can mark workouts as completed or not completed
- Register and list movements (exercises)
- User management (admin can edit, list, and modify users)
- Authentication and password recovery
- Dashboard for data visualization
- RESTful API for frontend integration

## Techonologies Used

- Next.js (App Router)
- React
- MongoDB (via Mongoose)
- Tailwind CSS (styling)
- PostCSS
- ESLint (code standardization)
- Node.js
- JWT (authentication)
- Custom Error Handling

## Screenshots
#### LOGIN:
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/450d8994-1889-4cc0-a9c3-67120cc63001" />

#### SIGNUP
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/8152eb35-1554-40a8-9d02-2699867575bd" />

#### RECOVER PASSWORD
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/d90c44de-a406-45d0-8ac6-70641c9dd337" />

#### COMPLETED WORKOUTS
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/ca620fc6-bb24-47e3-b939-34021f55cc7c" />

#### WORKOUTS
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/99b3ca5c-5684-4741-8880-8c4dd749419f" />


#### ADD NEW EXERCISE/MOVEMENT
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/0217399a-9535-4611-9b05-18a34d0c5456" />

#### UPDATE USER INFO
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/49d085c3-3781-4467-8593-e22be8a5173b" />

#### EDIT WORKOUT
<img width="640" height="445" alt="image" src="https://github.com/user-attachments/assets/4a5ec409-89bf-4d1d-b67c-83e798b1c8ce" />



## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/seu-usuario/kor-fbb.git
   cd kor-fbb
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables
   - Create a .env.local file at the root of the project
   - Add required variables:
  ```
 MONGODB_URI = your MongoDB URI
 DBACCESSTOKEN = your DB Access Token
 JWT_SECRET = your JWT  secret
  ```

## Configuration
- Make sure MongoDB is running locally or provide a valid connection URI
- Adjust Next.js and Tailwind settings in next.config.mjs and tailwind.config.mjs as needed


## Available Scripts

- `npm run dev` — Starts the development server
- `npm run build` — Builds the project for production
- `npm run start` — Starts the production server
- `npm run lint` — Runs ESLint for code analysis

## Folder Structure

```
app/                # Páginas e rotas do Next.js
components/         # Componentes reutilizáveis de UI e formulários
hooks/              # Custom hooks
lib/                # Lógica de negócio, ações, autenticação, banco de dados
models/             # Modelos Mongoose
public/             # Arquivos estáticos e imagens
utils/              # Utilitários diversos
```

## How to Contribute
- Fork the project
- Create a feature/fix branch: git checkout -b my-feature
- Commit your changes: git commit -m 'My feature'
- Push to your branch: git push origin my-feature
- Open a Pull Request


## License
This project is under the MIT license.

If you need deployment instructions, API integration guidance, or details about endpoints, check the config files or contact the project maintainer.
