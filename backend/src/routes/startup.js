const express = require('express');
const router = express.Router();

const db = require('../db');
const { generateStartup } = require('../services/aiService');

// ✅ caminho corrigido: routes -> src -> backend -> raiz
const { buildLandingPage } = require('../../../startup-builder/landingPageBuilder');

/*
========================================
1) GERAR (SEM SALVAR)
========================================
*/
router.post('/generate', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Campo "idea" é obrigatório' });
    }

    const startup = await generateStartup(idea);

    return res.json({
      success: true,
      startup
    });

  } catch (error) {
    console.error('ERRO /generate:', error);
    return res.status(500).json({ error: 'Erro ao gerar startup' });
  }
});

/*
========================================
2) GERAR E SALVAR STARTUP
========================================
*/
router.post('/generate-and-save', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Campo "idea" é obrigatório' });
    }

    const startup = await generateStartup(idea);

    const saved = await db.query(
      'INSERT INTO startups (idea, startup) VALUES ($1, $2::jsonb) RETURNING *',
      [idea, JSON.stringify(startup)]
    );

    return res.json({
      success: true,
      saved: saved.rows[0]
    });

  } catch (error) {
    console.error('ERRO /generate-and-save:', error);
    return res.status(500).json({ error: 'Erro ao gerar e salvar startup' });
  }
});

/*
========================================
3) LISTAR STARTUPS
========================================
*/
router.get('/list', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM startups ORDER BY id DESC');

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('ERRO /list:', error);
    return res.status(500).json({ error: 'Erro ao listar startups' });
  }
});

/*
========================================
4) GERAR ASSETS + LANDING (via startup-builder) + SALVAR
========================================
*/
router.post('/:id/generate-assets', async (req, res) => {
  try {
    const { id } = req.params;

    const startupResult = await db.query(
      'SELECT * FROM startups WHERE id = $1',
      [id]
    );

    if (startupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Startup não encontrada' });
    }

    const startupData = startupResult.rows[0].startup;
    const monetization = "Plano Free + Plano Pro mensal";

    const assets = {
      landing_headline: `Revolucione o mercado com ${startupData.name}`,
      value_proposition: startupData.description,
      target_audience: startupData.target_market,
      monetization,
      technical_stack: ["Node.js", "PostgreSQL", "React", "Stripe"],
      roadmap: ["MVP em 30 dias", "Primeiros 100 usuários", "Escala via marketing digital"]
    };

    // ✅ HTML gerado pelo builder (arquitetura original)
    const landing_html = buildLandingPage(startupData, assets);

    const assetsToSave = {
      ...assets,
      landing_html
    };

    const saved = await db.query(
      'INSERT INTO startup_assets (startup_id, assets) VALUES ($1, $2::jsonb) RETURNING *',
      [id, JSON.stringify(assetsToSave)]
    );

    return res.json({
      success: true,
      assets: saved.rows[0]
    });

  } catch (error) {
    console.error('ERRO /generate-assets:', error);
    return res.status(500).json({ error: 'Erro ao gerar assets da startup' });
  }
});

/*
========================================
5) ABRIR LANDING NO NAVEGADOR
========================================
*/
router.get('/:id/landing', async (req, res) => {
  try {
    const { id } = req.params;

    const lastAssets = await db.query(
      'SELECT assets FROM startup_assets WHERE startup_id = $1 ORDER BY id DESC LIMIT 1',
      [id]
    );

    if (lastAssets.rows.length === 0) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(404).send('Sem assets ainda. Gere em /generate-assets primeiro.');
    }

    const assets = lastAssets.rows[0].assets;
    const html = assets?.landing_html;

    if (!html) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(404).send('Sem landing_html. Gere assets novamente.');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);

  } catch (error) {
    console.error('ERRO /landing:', error);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send('Erro ao renderizar landing.');
  }
});

module.exports = router;