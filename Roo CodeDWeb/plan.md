# Plan para la Interfaz de Reserva de Citas Médicas

## 1. Estructura HTML para el formulario de reserva

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva de Citas Médicas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }

        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0,123,255,0.3);
        }

        .error {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }

        .submit-btn {
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }

        .submit-btn:hover {
            background-color: #0056b3;
        }

        .submit-btn:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reserva tu Cita Médica</h1>
        
        <div class="success-message" id="successMessage">
            ¡Cita reservada exitosamente!
        </div>
        
        <div class="error-message" id="errorMessage">
            Error al reservar la cita. Por favor, inténtalo de nuevo.
        </div>
        
        <form id="appointmentForm">
            <div class="form-group">
                <label for="clientName">Nombre del Cliente *</label>
                <input type="text" id="clientName" name="clientName" required>
                <div class="error" id="clientNameError">El nombre del cliente es obligatorio</div>
            </div>
            
            <div class="form-group">
                <label for="date">Fecha *</label>
                <input type="date" id="date" name="date" required>
                <div class="error" id="dateError">La fecha es obligatoria y debe ser válida</div>
            </div>
            
            <div class="form-group">
                <label for="time">Hora (HH:MM) *</label>
                <input type="time" id="time" name="time" required>
                <div class="error" id="timeError">La hora es obligatoria y debe estar en formato HH:MM</div>
            </div>
            
            <div class="form-group">
                <label for="serviceType">Tipo de Servicio *</label>
                <select id="serviceType" name="serviceType" required>
                    <option value="">Selecciona un servicio</option>
                    <option value="general">Consulta General</option>
                    <option value="cardiology">Cardiología</option>
                    <option value="dermatology">Dermatología</option>
                    <option value="pediatrics">Pediatría</option>
                    <option value="orthopedics">Ortopedia</option>
                </select>
                <div class="error" id="serviceTypeError">El tipo de servicio es obligatorio</div>
            </div>
            
            <button type="submit" class="submit-btn" id="submitBtn">Reservar Cita</button>
        </form>
    </div>

    <script>
        // Lógica de validación y envío del formulario
        document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar mensaje de carga o deshabilitar botón
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Reservando...';
            
            // Ocultar mensajes anteriores
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
            
            try {
                // Recoger datos del formulario
                const formData = {
                    client_name: document.getElementById('clientName').value.trim(),
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    service_type: document.getElementById('serviceType').value
                };
                
                // Validación adicional en el frontend
                if (!validateFormData(formData)) {
                    throw new Error('Datos inválidos');
                }
                
                // Enviar datos al endpoint
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Mostrar mensaje de éxito
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('appointmentForm').reset();
                } else {
                    // Mostrar mensaje de error
                    document.getElementById('errorMessage').style.display = 'block';
                    
                    // Manejar diferentes códigos de error
                    const errorData = await response.json();
                    console.error('Error del servidor:', errorData);
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                document.getElementById('errorMessage').style.display = 'block';
            } finally {
                // Restaurar estado del botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reservar Cita';
            }
        });
        
        // Función de validación de datos
        function validateFormData(data) {
            // Validar nombre del cliente (no vacío)
            if (!data.client_name || data.client_name.length < 2) {
                showError('clientName', 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            
            // Validar fecha (no vacía y no en el pasado)
            if (!data.date) {
                showError('date', 'La fecha es obligatoria');
                return false;
            }
            
            const selectedDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Establecer hora a inicio del día
            
            if (selectedDate < today) {
                showError('date', 'La fecha no puede ser en el pasado');
                return false;
            }
            
            // Validar hora (no vacía y en formato HH:MM)
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (!data.time || !timeRegex.test(data.time)) {
                showError('time', 'La hora debe estar en formato HH:MM');
                return false;
            }
            
            // Validar tipo de servicio (no vacío)
            if (!data.service_type) {
                showError('serviceType', 'Debes seleccionar un tipo de servicio');
                return false;
            }
            
            return true;
        }
        
        // Función para mostrar errores
        function showError(fieldId, message) {
            const errorElement = document.getElementById(fieldId + 'Error');
            const inputElement = document.getElementById(fieldId);
            
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            inputElement.style.borderColor = '#dc3545';
        }
        
        // Función para limpiar errores
        function clearError(fieldId) {
            const errorElement = document.getElementById(fieldId + 'Error');
            const inputElement = document.getElementById(fieldId);
            
            errorElement.style.display = 'none';
            inputElement.style.borderColor = '#ddd';
        }
        
        // Event listeners para validación en tiempo real
        document.getElementById('clientName').addEventListener('blur', function() {
            if (this.value.trim().length >= 2) {
                clearError('clientName');
            }
        });
        
        document.getElementById('date').addEventListener('blur', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate >= today) {
                clearError('date');
            }
        });
        
        document.getElementById('time').addEventListener('blur', function() {
            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (timeRegex.test(this.value)) {
                clearError('time');
            }
        });
        
        document.getElementById('serviceType').addEventListener('change', function() {
            if (this.value) {
                clearError('serviceType');
            }
        });
        
        // Establecer fecha mínima para el campo de fecha (hoy)
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').min = today;
    </script>
</body>
</html>
```

## 2. Validación mínima en el frontend

La validación en el frontend incluye:

- **Nombre del cliente**: No debe estar vacío y debe tener al menos 2 caracteres
- **Fecha**: No debe estar vacía y no debe ser una fecha en el pasado
- **Hora**: Debe estar en formato HH:MM (24 horas)
- **Tipo de servicio**: Debe estar seleccionado

Además, se implementa:
- Validación en tiempo real al salir de cada campo
- Validación adicional antes de enviar la solicitud
- Mostrar mensajes de error específicos para cada campo
- Validación del formato de hora con expresión regular

## 3. Lógica para enviar datos al endpoint /api/appointments

- Recopilar datos del formulario en formato JSON
- Validar datos antes de enviar
- Usar `fetch` para realizar una solicitud POST al endpoint `/api/appointments`
- Manejar respuestas exitosas y errores
- Mostrar mensajes de confirmación o error al usuario
- Manejar el estado de carga del botón de envío

## 4. Diagrama de flujo para la interfaz de usuario

```mermaid
graph TD
    A[Usuario accede a la página de reserva] --> B[Formulario se carga con campos vacíos]
    B --> C[Usuario completa los campos del formulario]
    C --> D{¿Todos los campos válidos?}
    D -->|No| E[Mostrar errores en campos inválidos]
    E --> C
    D -->|Sí| F[Usuario hace clic en "Reservar Cita"]
    F --> G[Deshabilitar botón y mostrar estado de carga]
    G --> H[Recopilar datos del formulario]
    H --> I[Validar datos nuevamente]
    I --> J{¿Datos válidos?}
    J -->|No| K[Mostrar mensaje de error]
    K --> L[Rehabilitar botón]
    L --> C
    J -->|Sí| M[Enviar solicitud POST a /api/appointments]
    M --> N{¿Solicitud exitosa?}
    N -->|Sí| O[Mostrar mensaje de éxito]
    N -->|No| P[Mostrar mensaje de error]
    O --> Q[Formulario se reinicia]
    P --> L
    Q --> R[Fin]
    R --> S[Usuario puede hacer nueva reserva]
    S --> C
```

## 5. Consideraciones de seguridad y usabilidad

### Seguridad:
- Validación tanto en frontend como en backend
- Prevención de inyección de datos maliciosos
- Uso de HTTPS para proteger la transmisión de datos
- Validación de formato en hora (HH:MM) usando expresiones regulares

### Usabilidad:
- Diseño responsive que se adapta a diferentes dispositivos
- Mensajes de error claros y específicos
- Indicador visual de campos obligatorios
- Validación en tiempo real para mejor experiencia de usuario
- Feedback visual durante el proceso de envío
- Fecha mínima establecida en el campo de fecha para evitar selección de fechas pasadas
- Botón de envío deshabilitado durante la solicitud para evitar envíos múltiples

### Accesibilidad:
- Etiquetas apropiadas para todos los campos de entrada
- Uso de atributos ARIA implícitos
- Contraste adecuado de colores
- Tamaño de fuente legible
- Soporte para navegación por teclado

## 6. Compatibilidad con el backend

- El formulario envía datos en el formato esperado por el backend
- El endpoint de destino coincide con las rutas API definidas
- Los nombres de los campos coinciden con las propiedades esperadas por el backend
- Se respetan los formatos de fecha y hora requeridos