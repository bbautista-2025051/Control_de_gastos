# Control de Gastos

Aplicación web para el control de gastos personales y familiares. Cuenta con un
frontend en **Angular**, un backend en **Express** con arquitectura por módulos y
una base de datos gestionada con **Prisma + PostgreSQL**.

## Estructura del proyecto

```
Control_de_gastos/
├── backend/          # API REST (Express + TypeScript)
│   └── src/
│       ├── app.ts            # Configuración y registro de módulos
│       ├── server.ts         # Punto de entrada del servidor
│       ├── config/           # Variables de entorno
│       ├── lib/              # Utilidades (Prisma, errores, validación)
│       ├── middlewares/      # Autenticación y autorización
│       └── module/           # Arquitectura por módulos
│           ├── auth/         # Login, sesión y perfil
│           └── expenses/     # CRUD de gastos
│               ├── controller/
│               ├── services/
│               ├── modules/
│               └── roots/
├── prisma/           # Schema, migraciones y seed
└── src/              # Frontend (Angular, standalone components)
    └── app/
        ├── core/             # Auth: servicio, interceptor, guard y modelos
        ├── features/         # Páginas (login, dashboard)
        └── shared/           # Componentes reutilizables (efectos del login)
```

## Requisitos

- Node.js 20+
- PostgreSQL

## Configuración

1. Clona el repositorio e instala las dependencias:

   ```bash
   npm install
   cd backend && npm install
   ```

2. Crea los archivos de entorno a partir de los ejemplos:

   ```bash
   cp .env.example .env          # raíz del proyecto
   cp backend/.env.example backend/.env   # backend
   ```

   Configura `DATABASE_URL` y `JWT_SECRET` con tus valores.

3. Ejecuta las migraciones y el seed:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Ejecución

**Backend** (puerto 4000):

```bash
cd backend
npm run dev
```

**Frontend** (puerto 4200):

```bash
npm start
```

Abre [http://localhost:4200](http://localhost:4200). El dev server de Angular
hace proxy de `/api` hacia el backend en `http://localhost:4000` (ver
`proxy.conf.json`).

## Cuentas de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@controlgastos.com` | `Admin123!` |
| Usuario | `usuario@controlgastos.com` | `Usuario123!` |

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo (Angular) |
| `npm run build` | Compila el proyecto para producción |
| `npm run watch` | Compila en modo observador |
| `npm run db:migrate` | Ejecuta las migraciones de Prisma |
| `npm run db:seed` | Carga los datos iniciales |
| `npm run db:studio` | Abre Prisma Studio |
| `cd backend && npm run dev` | Inicia el backend en modo desarrollo |
| `cd backend && npm run typecheck` | Verifica tipos del backend |
