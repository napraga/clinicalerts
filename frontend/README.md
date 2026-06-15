# ClinicSay — PatientAlertsPanel

Feature fullstack de alertas clínicas construida como prueba técnica take-home.

## Stack

| Capa         | Tecnología                              |
|--------------|-----------------------------------------|
| Backend      | NestJS · Prisma · SQLite (dev)          |
| Frontend     | React 18 · Vite · Tailwind CSS v4       |
| Tests        | Jest (backend) · Vitest + Testing Library (frontend) |
| Arquitectura | Domain-Driven Design (DDD)              |

---

## Setup

### Requisitos

- Node.js 20+
- npm 10+

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev         # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

### Tests

```bash
# Backend
cd backend
npm run test              # unit tests
npm run test:cov          # con cobertura

# Frontend
cd frontend
npm run test              # Vitest
```

---

## Endpoints

| Método   | Ruta                              | Descripción                      |
|----------|-----------------------------------|----------------------------------|
| `GET`    | `/patients/:patientId/alerts`     | Lista alertas ordenadas          |
| `POST`   | `/patients/:patientId/alerts`     | Crea alerta (valida duplicados)  |
| `PATCH`  | `/patient-alerts/:alertId`        | Edita severidad, mensaje, estado |
| `DELETE` | `/patient-alerts/:alertId`        | Elimina alerta                   |

---

## Arquitectura y decisiones técnicas

### DDD en cuatro capas

```
api/          → Controlador delgado. Traduce HTTP ↔ comandos. No contiene lógica.
application/  → Casos de uso. Orquestan dominio e infraestructura.
domain/       → Entidad PatientAlert, value objects, errores, interfaz IAlertRepository.
infrastructure/ → PrismaAlertRepository. Única pieza que conoce Prisma.
```

### Regla anti-duplicados

La regla *"no puede existir más de una alerta activa idéntica para el mismo paciente"* vive en `CreateAlertUseCase`, no en el controlador ni en un constraint de base de datos.

**¿Por qué en el caso de uso?**
Cualquier punto de entrada al sistema (otro servicio, un worker, un script) pasa por el caso de uso. Si la regla viviera en el controlador, un segundo punto de entrada la saltaría. Si viviera solo en BD, el error llegaría como excepción técnica sin semántica de negocio.

### Inversión de dependencias con Symbol

```typescript
export const ALERT_REPOSITORY = Symbol('IAlertRepository');
```

Los casos de uso dependen de `IAlertRepository` (interfaz del dominio). El módulo NestJS resuelve en runtime que esa interfaz es `PrismaAlertRepository`. Cambiar de ORM es un cambio de una línea en el módulo.

### AlertMapper

Traduce entre el modelo Prisma (registro plano) y la entidad de dominio (con comportamiento). Vive en infraestructura porque es la única capa que puede conocer ambos mundos. El dominio nunca importa `@prisma/client`.

### Ordenamiento de alertas

El repositorio ordena `{ isActive: 'desc', createdAt: 'desc' }`. Las alertas activas aparecen primero; dentro de ellas, las más recientes arriba. Esta decisión podría moverse al caso de uso si el criterio de ordenamiento fuera regla de negocio, pero al ser puramente de presentación vive en la query.

---

## Cobertura de tests

| Archivo                              | Qué verifica                                      |
|--------------------------------------|---------------------------------------------------|
| `patient-alert.entity.spec.ts`       | Creación, activar/desactivar, detección duplicados |
| `create-alert.use-case.spec.ts`      | Regla anti-duplicados, happy path, alerta activa  |
| `get-alerts.use-case.spec.ts`        | Lista correcta, array vacío                       |
| `patient-alerts.controller.spec.ts`  | POST 201, POST 409, POST 400, GET 200             |
| `PatientAlertsPanel.test.tsx`        | Loading, error, vacío, crear, duplicado, validación |

---

## Uso de IA

### Herramienta

Claude (Anthropic) — conversación iterativa durante todo el desarrollo.

### Qué generó la IA

- Estructura inicial de carpetas DDD y razonamiento de capas
- `PrismaService` con `onModuleInit` / `onModuleDestroy` y helper `cleanDatabase`
- `AlertMapper` con métodos `toDomain` / `toPrisma`
- Esqueleto de casos de uso y firmas de métodos del repositorio
- DTOs con decoradores `class-validator`
- Componentes React (`AlertCard`, `AlertForm`, `PatientAlertsPanel`) con Tailwind
- Tests unitarios de dominio y casos de uso
- Tests de UI con Vitest + Testing Library

### Qué revisé y ajusté manualmente

- **Regla de negocio en `UpdateAlertUseCase`**: la IA generó la verificación de duplicados al crear, pero no contempló el caso de reactivar una alerta desactivada. Agregué la validación de duplicado también en `update` cuando `isActive` cambia a `true`.
- **`@@unique` en Prisma**: la primera versión del schema tenía un constraint de unicidad en BD. Lo eliminé — la regla pertenece al dominio, no a la capa de persistencia.
- **Ordenamiento**: el primer `findByPatient` no tenía `orderBy`. Lo agregué con `isActive: 'desc'` para cumplir el criterio de "activas primero" del enunciado.
- **`saveError` en `useAlerts`**: el hook inicial limpiaba el error en cada operación pero no lo exponía correctamente al `AlertForm`. Refactoricé para que `saveError` sea estado compartido entre crear y actualizar.
- **Tests del controlador**: los UUIDs en los params fallaban sin `ParseUUIDPipe` en el setup del test. Ajusté el módulo de test para incluir el pipe global.

### Errores detectados durante revisión

- La IA generó `@IsNotEmpty()` en el DTO sin `@IsString()` previo — `class-validator` requiere el orden correcto para que la transformación funcione con `transform: true`.
- El mapper inicial retornaba `updatedAt` como `Date` pero la entidad no tenía el campo declarado en el constructor. Sincronicé la firma.
- `AlertForm` tenía el tipo del `onSubmit` como `CreateAlertPayload` pero al editar se llama con `UpdateAlertPayload`. Unifiqué usando `CreateAlertPayload` como base y casteando en el panel.

### Conclusión sobre el uso de IA

La IA aceleró significativamente el scaffolding y la escritura de boilerplate (módulos NestJS, DTOs, configuración de Vite). El criterio técnico — dónde vive la regla de negocio, qué pertenece a cada capa, qué casos edge cubrir en tests — requirió revisión y decisión humana en cada paso. La IA es un acelerador, no un sustituto del razonamiento de producto.

---

## Estructura completa del proyecto

```
clinicsay-alerts/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── prisma/
│       ├── patients/alerts/
│       │   ├── api/
│       │   ├── application/
│       │   ├── domain/
│       │   └── infrastructure/
│       ├── app.module.ts
│       └── main.ts
├── frontend/
│   └── src/
│       ├── api/
│       ├── hooks/
│       ├── components/alerts/
│       └── pages/
└── README.md
```