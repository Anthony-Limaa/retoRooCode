/**
 * Rutas para el sistema de citas médicas
 * Implementa la lógica de prevención de duplicados según la estrategia definida
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE; // Usar la clave de servicio para operaciones seguras
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Normaliza una fecha a formato YYYY-MM-DD
 * @param {any} dateInput - Fecha a normalizar
 * @returns {string|null} Fecha en formato YYYY-MM-DD o null si inválida
 */
function normalizeDate(dateInput) {
  try {
    // Si es un string vacío o null, devolver null
    if (!dateInput) return null;

    let date;

    // Si es un objeto Date
    if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Si es un string en formato ISO con milisegundos
    else if (typeof dateInput === 'string') {
      // Rechazar si contiene AM/PM
      if (dateInput.toUpperCase().includes('AM') || dateInput.toUpperCase().includes('PM')) {
        return null;
      }

      // Extraer solo la parte de fecha del string ISO
      if (dateInput.includes('T')) {
        date = new Date(dateInput.split('T')[0]);
      } else {
        date = new Date(dateInput);
      }
    }
    // Si es un timestamp (número)
    else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    }
    else {
      return null;
    }

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return null;
    }

    // Formatear como YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
}

/**
 * Normaliza una hora a formato HH:MM (24h)
 * @param {any} timeInput - Hora a normalizar
 * @returns {string|null} Hora en formato HH:MM o null si inválida
 */
function normalizeTime(timeInput) {
  try {
    // Si es un string vacío o null, devolver null
    if (!timeInput) return null;

    // Si es un string
    if (typeof timeInput === 'string') {
      // Rechazar si contiene AM/PM
      if (timeInput.toUpperCase().includes('AM') || timeInput.toUpperCase().includes('PM')) {
        return null;
      }

      // Si contiene segundos o milisegundos, removerlos
      let timeStr = timeInput.split(':').slice(0, 2).join(':');

      // Si ya está en formato HH:MM, validar directamente
      if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
        return timeStr;
      }

      // Intentar parsear como Date para extraer hora y minutos
      const date = new Date(`1970-01-01T${timeStr}:00`);
      if (isNaN(date.getTime())) {
        return null;
      }

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    }

    // Si es un objeto Date
    if (timeInput instanceof Date) {
      const hours = String(timeInput.getHours()).padStart(2, '0');
      const minutes = String(timeInput.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * POST /appointments
 * Crea una nueva cita médica con verificación de duplicados
 *
 * @route POST /appointments
 * @param {string} client_name - Nombre del cliente
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:MM
 * @param {string} service_type - Tipo de servicio médico
 * @returns {object} 201 - Cita creada exitosamente o 409 - Cita ya reservada
 */
router.post('/', async (req, res) => {
  try {
    // 1. Extraer datos del cuerpo de la solicitud
    const { client_name, date: rawDate, time: rawTime, service_type } = req.body;

    // 2. Validar campos obligatorios
    if (!client_name || !rawDate || !rawTime || !service_type) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios',
        required: ['client_name', 'date', 'time', 'service_type']
      });
    }

    // 3. Normalizar y validar fecha
    const normalizedDate = normalizeDate(rawDate);
    if (!normalizedDate) {
      return res.status(400).json({
        error: 'Formato de fecha inválido. Use YYYY-MM-DD (ISO 8601) sin hora ni zona horaria'
      });
    }

    // 4. Normalizar y validar hora
    const normalizedTime = normalizeTime(rawTime);
    if (!normalizedTime) {
      return res.status(400).json({
        error: 'Formato de hora inválido. Use HH:MM (24 horas) sin segundos ni AM/PM'
      });
    }

    const date = normalizedDate;
    const time = normalizedTime;

    // 5. Verificar que la fecha no sea en el pasado
    const today = new Date();
    const appointmentDate = new Date(date);
    
    // Convertir ambas fechas a su formato de fecha local sin tiempo
    const todayStr = today.toLocaleDateString();
    const appointmentStr = appointmentDate.toLocaleDateString();
    
    // Comparar solo las fechas
    if (appointmentStr < todayStr) {
      return res.status(400).json({
        error: 'La fecha no puede ser en el pasado'
      });
    }

    // Si es hoy, verificar la hora
    if (appointmentStr === todayStr) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      if (time < currentTimeStr) {
        return res.status(400).json({
          error: 'La hora no puede ser en el pasado'
        });
      }
    }

    // 6. Verificar duplicados antes de insertar
    const { data: existingAppointment, error: selectError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .single();

    // 7. Verificar si existe una cita con la misma fecha y hora
    if (!selectError && existingAppointment) {
      return res.status(409).json({
        error: 'Cita ya reservada',
        message: 'Ya existe una cita programada para esta fecha y hora'
      });
    }

    // Si hay error y no es "no rows found", hay un problema
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error al verificar duplicados:', selectError);
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al verificar disponibilidad de la cita'
      });
    }

    // 8. Insertar nueva cita en la base de datos
    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert([
        {
          client_name,
          date,
          time,
          service_type
        }
      ])
      .select()
      .single();

    // Verificar si hubo error en la inserción
    if (insertError) {
      console.error('Error al insertar cita:', insertError);

      // Si es error de restricción única (por si acaso)
      if (insertError.code === '23505') {
        return res.status(409).json({
          error: 'Cita ya reservada',
          message: 'Ya existe una cita programada para esta fecha y hora'
        });
      }

      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo crear la cita'
      });
    }

    // 9. Retornar respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: newAppointment
    });

  } catch (error) {
    console.error('Error inesperado al crear cita:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error inesperado al procesar la solicitud'
    });
  }
});

module.exports = router;