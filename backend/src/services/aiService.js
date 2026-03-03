const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function mockStartup(idea) {
  const niche = (idea || "negócios").slice(0, 40);
  return {
    name: `Nova ${niche}`.replace(/\s+/g, " ").trim(),
    description: `Startup gerada em modo MOCK a partir da ideia: ${idea}`,
    business_model: "Assinatura (SaaS)",
    target_market: "Pequenas e médias empresas",
    features: [
      "Cadastro/login",
      "Dashboard",
      "Gestão de projetos",
      "Integrações (email/whatsapp)",
      "Relatórios/analytics"
    ]
  };
}

async function generateStartup(idea) {
  // Se estiver em mock, nem tenta chamar API
  if ((process.env.AI_MODE || "mock").toLowerCase() !== "openai") {
    return mockStartup(idea);
  }

  const prompt = `
Gere uma startup baseada na ideia abaixo e retorne APENAS um JSON válido neste formato:
{
  "name": "",
  "description": "",
  "business_model": "",
  "target_market": "",
  "features": []
}

IDEIA: ${idea}
  `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices?.[0]?.message?.content || "";
    // tenta parsear JSON; se falhar, devolve como mock
    try {
      return JSON.parse(text);
    } catch {
      return mockStartup(idea);
    }
  } catch (err) {
    // Se falhar por quota/429, volta pro mock automaticamente
    return mockStartup(idea);
  }
}

module.exports = { generateStartup };