const express = require('express');
const router = express.Router();

// ✅ caminho corrigido a partir de backend/src/routes/
const AIOrchestrator = require('../../../ai-engine/orchestrator');
const orchestrator = new AIOrchestrator();

/**
 * Cria uma startup completa (mock) usando os agentes
 */
router.post('/create-startup', async (req, res) => {
  try {
    const { idea, preferences } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Campo "idea" é obrigatório' });
    }

    const result = await orchestrator.createStartup(idea, preferences || {});
    return res.json({ success: true, result });

  } catch (error) {
    console.error('ERRO /orchestrator/create-startup:', error);
    return res.status(500).json({ error: 'Erro no orchestrator' });
  }
});

module.exports = router;