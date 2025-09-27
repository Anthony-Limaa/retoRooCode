# Sistema RESTful para Gestión de Citas Médicas

## Descripción General

Este sistema proporciona una API RESTful para gestionar citas médicas simples. La entidad principal es `Appointment` que representa una cita médica con información sobre el cliente, fecha, hora y tipo de servicio.

## Modelo de Datos

### Entidad: Appointment

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la cita |
| client_name | VARCHAR(255) | NOT NULL | Nombre del cliente |
| date | DATE | NOT NULL, >= CURRENT_DATE | Fecha de la cita |
| time | TIME | NOT NULL | Hora de la cita en formato HH:MM |
| service_type | VARCHAR(100) | NOT NULL | Tipo de servicio médico |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de creación |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de última actualización |

## Diseño de la API RESTful

### 1. POST /api/appointments
**Propósito**: Crear una nueva cita médica.
**Funcionalidad**: Permite a los usuarios registrar una nueva cita con los datos necesarios (nombre del cliente, fecha, hora y tipo de servicio).

### 2. GET /api/appointments
**Propósito**: Obtener todas las citas médicas.
**Funcionalidad**: Recupera una lista de todas las citas con posibilidad de filtrado por fecha, nombre del cliente o tipo de servicio. Incluye paginación para manejar grandes volúmenes de datos.

### 3. GET /api/appointments/{id}
**Propósito**: Obtener una cita específica.
**Funcionalidad**: Recupera los detalles completos de una cita específica usando su identificador único.

### 4. PUT /api/appointments/{id}
**Propósito**: Actualizar completamente una cita existente.
**Funcionalidad**: Reemplaza todos los datos de una cita existente con nuevos valores. Requiere proporcionar todos los campos obligatorios.

### 5. PATCH /api/appointments/{id}
**Propósito**: Actualizar parcialmente una cita existente.
**Funcionalidad**: Permite modificar solo algunos campos de una cita existente sin afectar los demás.

### 6. DELETE /api/appointments/{id}
**Propósito**: Eliminar una cita específica.
**Funcionalidad**: Elimina permanentemente una cita del sistema usando su identificador único.

## Consideraciones de Seguridad

- Validación de formato para asegurar que la hora esté en formato HH:MM
- Validación para asegurar que la fecha no sea en el pasado
- Restricciones en la base de datos para campos obligatorios

## Consideraciones de Rendimiento

- Índices en campos frecuentemente consultados (fecha, nombre del cliente, tipo de servicio)
- Paginación implementada en la consulta de todas las citas para evitar sobrecarga

## Diagrama de Flujo de la API

```mermaid
graph TD
    A[Cliente] --> B[POST /api/appointments]
    A --> C[GET /api/appointments]
    A --> D[GET /api/appointments/{id}]
    A --> E[PUT /api/appointments/{id}]
    A --> F[PATCH /api/appointments/{id}]
    A --> G[DELETE /api/appointments/{id}]
    B --> H[Crear cita en DB]
    C --> I[Leer citas de DB]
    D --> J[Leer cita específica de DB]
    E --> K[Actualizar cita en DB]
    F --> L[Actualizar parcialmente cita en DB]
    G --> M[Eliminar cita de DB]
    H --> N[Respuesta 201 Created]
    I --> O[Respuesta 200 OK]
    J --> P[Respuesta 200 OK]
    K --> Q[Respuesta 200 OK]
    L --> R[Respuesta 200 OK]
    M --> S[Respuesta 204 No Content]
```

## Consideraciones Adicionales

- El sistema utiliza UUID como identificador único para evitar conflictos y mejorar la seguridad
- Se incluyen campos de auditoría (created_at, updated_at) para seguimiento de cambios
- La base de datos incluye restricciones para mantener la integridad de los datos
- Las rutas siguen convenciones RESTful para una fácil comprensión y mantenimiento