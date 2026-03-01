/**
 * Servidor Principal - AI Autonomous Startup Factory
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Conexão com banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Importar rotas
const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const aiRoutes = require('./src/routes/ai');
const templateRoutes = require('./src/routes/templates');
const deployRoutes = require('./src/routes/deploy');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();

  });

};

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/templates', authenticateToken, templateRoutes);
app.use('/api/deploy', authenticateToken, deployRoutes);

// Health check
app.get('/health', (req, res) => {

  res.json({
    status: 'AI Startup Factory is running'
  });

});

// Tratamento de erros global
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 AI Startup Factory Backend rodando em porta ${PORT}`);

});

module.exports = app;
