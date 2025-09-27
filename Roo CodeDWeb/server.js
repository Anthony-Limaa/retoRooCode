require('dotenv').config();
const express = require('express');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/appointments', appointmentsRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
