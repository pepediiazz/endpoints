import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
connectToDatabase();
// Importar y usar las rutas
const authRoutes = require('./routes/authRoutes.ts');
app.use('/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`),
);
