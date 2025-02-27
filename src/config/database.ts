// database.ts
const mongoose = require('mongoose');

// Función de conexión a la base de datos
export const connectToDatabase = async () => {
  const uri = process.env.DATABASE_URL as string;
  try {
    await mongoose.connect(uri);
    console.log('Conexión exitosa a MongoDB');
  } catch (err) {
    console.error(`Algo no fue como lo esperado: ${err}`);
  }
};
export { mongoose };
