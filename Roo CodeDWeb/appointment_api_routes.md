# Rutas API RESTful para Sistema de Citas Médicas

## Operaciones CRUD para Appointments

### 1. Crear una nueva cita
- **Método HTTP**: POST
- **Endpoint**: `/api/appointments`
- **Descripción**: Crea una nueva cita médica con los datos proporcionados
- **Cuerpo de la solicitud (JSON)**:
```json
{
  "client_name": "string (obligatorio)",
  "date": "date (obligatorio, formato YYYY-MM-DD)",
  "time": "string (obligatorio, formato HH:MM)",
  "service_type": "string (obligatorio)"
}
```
- **Código de respuesta exitosa**: 201 Created
- **Ejemplo de respuesta**:
```json
{
  "id": "uuid",
  "client_name": "string",
  "date": "date",
  "time": "string",
  "service_type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2. Obtener todas las citas
- **Método HTTP**: GET
- **Endpoint**: `/api/appointments`
- **Descripción**: Obtiene una lista de todas las citas médicas
- **Parámetros de consulta opcionales**:
  - `date`: Filtrar por fecha específica (formato YYYY-MM-DD)
  - `client_name`: Filtrar por nombre del cliente (búsqueda parcial)
  - `service_type`: Filtrar por tipo de servicio
  - `limit`: Límite de resultados (por defecto 50)
  - `offset`: Desplazamiento para paginación (por defecto 0)
- **Código de respuesta exitosa**: 200 OK
- **Ejemplo de respuesta**:
```json
{
  "appointments": [
    {
      "id": "uuid",
      "client_name": "string",
      "date": "date",
      "time": "string",
      "service_type": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

### 3. Obtener una cita específica
- **Método HTTP**: GET
- **Endpoint**: `/api/appointments/{id}`
- **Descripción**: Obtiene los detalles de una cita específica por su ID
- **Parámetros de ruta**:
  - `id`: UUID de la cita (obligatorio)
- **Código de respuesta exitosa**: 200 OK
- **Ejemplo de respuesta**:
```json
{
  "id": "uuid",
  "client_name": "string",
  "date": "date",
  "time": "string",
  "service_type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4. Actualizar una cita existente
- **Método HTTP**: PUT
- **Endpoint**: `/api/appointments/{id}`
- **Descripción**: Actualiza completamente los datos de una cita existente
- **Parámetros de ruta**:
  - `id`: UUID de la cita (obligatorio)
- **Cuerpo de la solicitud (JSON)**:
```json
{
  "client_name": "string (obligatorio)",
  "date": "date (obligatorio, formato YYYY-MM-DD)",
  "time": "string (obligatorio, formato HH:MM)",
  "service_type": "string (obligatorio)"
}
```
- **Código de respuesta exitosa**: 200 OK
- **Ejemplo de respuesta**:
```json
{
  "id": "uuid",
  "client_name": "string",
  "date": "date",
  "time": "string",
  "service_type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 5. Actualización parcial de una cita
- **Método HTTP**: PATCH
- **Endpoint**: `/api/appointments/{id}`
- **Descripción**: Actualiza parcialmente los datos de una cita existente
- **Parámetros de ruta**:
  - `id`: UUID de la cita (obligatorio)
- **Cuerpo de la solicitud (JSON)** (solo campos a actualizar):
```json
{
  "client_name": "string (opcional)",
  "date": "date (opcional, formato YYYY-MM-DD)",
  "time": "string (opcional, formato HH:MM)",
  "service_type": "string (opcional)"
}
```
- **Código de respuesta exitosa**: 200 OK
- **Ejemplo de respuesta**:
```json
{
  "id": "uuid",
  "client_name": "string",
  "date": "date",
  "time": "string",
  "service_type": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 6. Eliminar una cita
- **Método HTTP**: DELETE
- **Endpoint**: `/api/appointments/{id}`
- **Descripción**: Elimina una cita específica por su ID
- **Parámetros de ruta**:
  - `id`: UUID de la cita (obligatorio)
- **Código de respuesta exitosa**: 204 No Content
- **Ejemplo de respuesta**: Sin contenido en el cuerpo