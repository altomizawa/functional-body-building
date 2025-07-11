# KOR FBB

Sistema de gerenciamento de treinos, movimentos e usuários para academias, desenvolvido com Next.js, MongoDB e autenticação personalizada.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

---

## Visão Geral

Este projeto permite o gerenciamento de treinos, movimentos, usuários e sessões, com autenticação e autorização baseada em papéis (admin/usuário). O sistema é voltado para academias e treinadores que desejam organizar programas de treino, registrar progresso e controlar acesso.

## Funcionalidades

- Cadastro, edição e exclusão de treinos (workouts) por programa, semana e dia.
- Marcação de treinos como concluídos ou não concluídos por usuários.
- Cadastro e listagem de movimentos (exercícios).
- Gerenciamento de usuários (admin pode editar, listar e modificar usuários).
- Autenticação e recuperação de senha.
- Dashboard para visualização dos dados.
- API RESTful para integração com frontend.

## Tecnologias Utilizadas

- **Next.js** (App Router)
- **React**
- **MongoDB** (via Mongoose)
- **Tailwind CSS** (estilização)
- **PostCSS**
- **ESLint** (padronização de código)
- **Node.js**
- **JWT** (autenticação)
- **Custom Error Handling**

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/kor-fbb.git
   cd kor-fbb
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione as variáveis necessárias, por exemplo:
     ```
    MONGODB_URI = your MongoDB URI
    DBACCESSTOKEN = your DB Access Token
    JWT_SECRET = your JWT  secret
     ```

## Configuração

- Certifique-se de que o MongoDB está rodando localmente ou forneça uma URI de conexão válida.
- Ajuste as configurações do Next.js e Tailwind conforme necessário nos arquivos `next.config.mjs` e `tailwind.config.mjs`.

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento.
- `npm run build` — Compila o projeto para produção.
- `npm run start` — Inicia o servidor em modo produção.
- `npm run lint` — Executa o ESLint para análise de código.

## Estrutura de Pastas

```
app/                # Páginas e rotas do Next.js
components/         # Componentes reutilizáveis de UI e formulários
hooks/              # Custom hooks
lib/                # Lógica de negócio, ações, autenticação, banco de dados
models/             # Modelos Mongoose
public/             # Arquivos estáticos e imagens
utils/              # Utilitários diversos
```

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature/fix: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'Minha feature'`
4. Faça push para a branch: `git push origin minha-feature`
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença MIT.

---

Se precisar de instruções específicas para deploy, integração ou dúvidas sobre endpoints da API, consulte os arquivos de configuração ou entre em contato com o mantenedor do projeto.