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

3. Ejecuta las migraciones y el seed (ver guía detallada abajo):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Migración de la base de datos (paso a paso)

1. **Instala PostgreSQL** (versión 14 o superior) y verifica que el servicio
   esté corriendo en el puerto `5432`.

2. **Crea la base de datos** `control_gastos`:

   ```bash
   psql -U postgres -c "CREATE DATABASE control_gastos;"
   ```

3. **Configura las variables de entorno** copiando los ejemplos (paso 2 de
   *Configuración*) y coloca tu contraseña real en `DATABASE_URL`:

   ```
   postgresql://postgres:TU_PASSWORD@localhost:5432/control_gastos?schema=public
   ```

   > El CLI de Prisma lee el `.env` de la **raíz** mediante
   > `prisma.config.ts`; el backend lee el suyo en `backend/.env`.

4. **Instala las dependencias** en la raíz y en el backend:

   ```bash
   npm install
   cd backend && npm install
   ```

5. **Aplica las migraciones**, que crean las tablas `User` y `Expense`
   definidas en `prisma/schema.prisma` a partir de los archivos en
   `prisma/migrations/`:

   ```bash
   npm run db:migrate
   ```

   Este comando también genera el cliente de Prisma en
   `backend/src/generated/prisma`.

6. **(Opcional) Regenera el cliente** si cambiaste el schema sin migrar:

   ```bash
   npx prisma generate
   ```

7. **Carga los datos iniciales** (usuarios de prueba y gastos de ejemplo):

   ```bash
   npm run db:seed
   ```

8. **Verifica la base de datos** con Prisma Studio (se abre en
   `http://localhost:5555`):

   ```bash
   npm run db:studio
   ```

9. **Si algo sale mal**, reinicia por completo (borra datos, reaplica
   migraciones y vuelve a ejecutar el seed):

   ```bash
   npx prisma migrate reset
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
