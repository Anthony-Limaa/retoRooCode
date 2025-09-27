# Esquema de Base de Datos para Sistema de Citas Médicas

## Tabla: appointments

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por fecha
CREATE INDEX idx_appointments_date ON appointments(date);

-- Índice para búsquedas por nombre de cliente
CREATE INDEX idx_appointments_client_name ON appointments(client_name);

-- Índice para búsquedas por tipo de servicio
CREATE INDEX idx_appointments_service_type ON appointments(service_type);

-- Restricción para asegurar que la hora esté en formato HH:MM
ALTER TABLE appointments 
ADD CONSTRAINT chk_time_format 
CHECK (time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');

-- Restricción para asegurar que la fecha no sea en el pasado
ALTER TABLE appointments 
ADD CONSTRAINT chk_future_date 
CHECK (date >= CURRENT_DATE);
```

### Descripción de campos:

- **id**: UUID único que identifica cada cita, generado automáticamente
- **client_name**: Nombre del cliente (string), no nulo
- **date**: Fecha de la cita (date), no nulo
- **time**: Hora de la cita (time en formato HH:MM), no nulo
- **service_type**: Tipo de servicio médico (string), no nulo
- **created_at**: Fecha y hora de creación del registro, generado automáticamente
- **updated_at**: Fecha y hora de última actualización del registro, generado automáticamente

### Restricciones:

- Llave primaria en el campo id
- Campos client_name, date, time y service_type no pueden ser nulos
- Validación de formato de hora para asegurar formato HH:MM
- Validación para asegurar que la fecha no sea en el pasado