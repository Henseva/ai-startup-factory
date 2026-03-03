const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {

    const projects = await db.query('SELECT * FROM projects ORDER BY id DESC');

    res.json({
      success: true,
      data: projects.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar projetos"
    });

  }
});


router.post('/create', async (req, res) => {

  try {

    const { name, type } = req.body;

    const newProject = await db.query(
      'INSERT INTO projects (name, type) VALUES ($1, $2) RETURNING *',
      [name, type]
    );

    res.json({
      success: true,
      project: newProject.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar projeto"
    });

  }

});

module.exports = router;