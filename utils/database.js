const mongoose = require('mongoose');

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI não definido - a saltar conexão com base de dados');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado com sucesso');
  } catch (err) {
    console.error('❌ Erro MongoDB:', err.message);
  }
}

module.exports = { connectDB };
