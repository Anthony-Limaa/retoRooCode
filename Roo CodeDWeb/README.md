# Sistema de Citas Médicas - API REST

Una API RESTful para gestionar citas médicas construida con Node.js, Express y Supabase.

## 🚀 Características

- ✅ Creación de citas con prevención de duplicados
- ✅ Validación completa de datos
- ✅ Manejo robusto de errores
- ✅ Soporte para concurrencia
- ✅ Documentación completa

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- Cuenta de Supabase
- Base de datos PostgreSQL en Supabase

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd sistema-citas-medicas
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` con tus credenciales de Supabase:
   ```env
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   PORT=3000
   ```

4. **Configura la base de datos en Supabase:**

   Ejecuta el script SQL del archivo `appointment_system_schema.md` en tu proyecto de Supabase para crear la tabla y restricciones necesarias.

## 🏃‍♂️ Uso

### Iniciar el servidor

```bash
npm start
# o para desarrollo
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Endpoint principal

#### Crear una nueva cita

```http
POST /appointments
Content-Type: application/json

{
  "client_name": "Juan Pérez",
  "date": "2024-12-25",
  "time": "10:30",
  "service_type": "consulta_general"
}
```

**Respuestas:**

- **201 Created:** Cita creada exitosamente
  ```json
  {
    "success": true,
    "message": "Cita creada exitosamente",
    "data": {
      "id": "uuid-generado",
      "client_name": "Juan Pérez",
      "date": "2024-12-25",
      "time": "10:30",
      "service_type": "consulta_general",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  }
  ```

- **409 Conflict:** Cita ya reservada
  ```json
  {
    "error": "Cita ya reservada",
    "message": "Ya existe una cita programada para esta fecha y hora"
  }
  ```

- **400 Bad Request:** Datos inválidos
  ```json
  {
    "error": "Formato de fecha inválido. Use YYYY-MM-DD"
  }
  ```

## 🏗️ Arquitectura

```
├── routes/
│   └── appointments.js    # Rutas de citas con lógica de negocio
├── app.js                # Servidor Express principal
├── .env.example          # Variables de entorno de ejemplo
└── README.md            # Esta documentación
```

## 🔒 Prevención de Duplicados

El sistema implementa una estrategia de doble capa para prevenir citas duplicadas:

1. **Validación en la aplicación:** Verifica duplicados antes de insertar
2. **Restricción en la base de datos:** Índice único en `(date, time)`
3. **Manejo de concurrencia:** Usa transacciones para evitar race conditions

## 🧪 Pruebas

Para probar la API, puedes usar herramientas como:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/)

### Ejemplo con curl:

```bash
# Crear una cita
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "María García",
    "date": "2024-12-25",
    "time": "14:00",
    "service_type": "odontología"
  }'

# Verificar estado del servidor
curl http://localhost:3000/health
```

## 🚦 Códigos de Estado HTTP

- `200` - OK
- `201` - Created (cita creada exitosamente)
- `400` - Bad Request (datos inválidos)
- `409` - Conflict (cita duplicada)
- `500` - Internal Server Error

## 📚 Documentación Adicional

- [Esquema de Base de Datos](appointment_system_schema.md)
- [Rutas de la API](appointment_api_routes.md)
- [Documentación del Sistema](appointment_system_documentation.md)
- [Estrategia de Prevención de Duplicados](appointment_duplicate_prevention_strategy.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.