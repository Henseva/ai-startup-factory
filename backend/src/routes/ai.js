const express = require('express');
const router = express.Router();

router.post('/build-startup', async (req, res) => {

  const { niche } = req.body;

  const startup = {

    name: "Smart" + niche,

    idea: `Uma plataforma SaaS focada em ${niche} usando automação e IA.`,

    targetAudience: `Empresas e profissionais interessados em ${niche}`,

    businessModel: "Assinatura mensal SaaS",

    marketingStrategy: [
      "SEO",
      "Conteúdo em redes sociais",
      "Anúncios pagos",
      "Parcerias estratégicas"
    ]

  };

  res.json({
    startup
  });

});

module.exports = router;