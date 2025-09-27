/**
 * Servidor principal para el sistema de citas médicas
 * Ejemplo de integración con Express y las rutas de appointments
 */

const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/appointments', appointmentRoutes);

// Ruta de salud para verificar que el servidor esté funcionando
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sistema de citas médicas funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📅 Sistema de citas médicas listo para recibir solicitudes`);
  console.log(`🏥 Rutas disponibles:`);
  console.log(`   POST /appointments - Crear nueva cita`);
  console.log(`   GET  /health - Verificar estado del servidor`);
});

module.exports = app;