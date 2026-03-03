/**
 * Product Planner Agent
 * Planeja arquitetura e features do produto.
 *
 * Modos:
 * - AI_MODE=mock   -> não chama OpenAI (sempre retorna plano padrão)
 * - AI_MODE=openai -> chama OpenAI, com fallback para plano padrão se der erro/quota
 */

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

function safeJsonParse(text) {
  if (!text) return null;

  // tenta achar o primeiro bloco JSON na resposta
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

  const jsonCandidate = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(jsonCandidate);
  } catch {
    return null;
  }
}

function generateDefaultProductPlan(idea) {
  return {
    description: `Produto baseado em: ${idea}`,
    targetAudience: 'Usuários gerais',
    mvpFeatures: [
      'Autenticação de usuário',
      'Dashboard principal',
      'Gerenciamento de dados',
      'Relatórios básicos'
    ],
    secondaryFeatures: [
      'Notificações',
      'Integração com APIs',
      'Analytics avançado',
      'Exportação de dados'
    ],
    architecture: {
      frontend: 'React + Next.js',
      backend: 'Node.js + Express',
      database: 'PostgreSQL'
    },
    userFlows: [
      'Onboarding -> Cadastro/Login -> Dashboard -> Criar/Editar -> Visualizar -> Exportar'
    ],
    roadmap: [
      { phase: 1, name: 'MVP', duration: '4 semanas' },
      { phase: 2, name: 'Beta', duration: '4 semanas' },
      { phase: 3, name: 'Launch', duration: '2 semanas' }
    ],
    successMetrics: [
      'User acquisition',
      'Retention rate',
      'NPS score',
      'Revenue'
    ]
  };
}

async function callOpenAI({ apiKey, model, prompt }) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Você é um especialista em desenvolvimento de produtos (Product Manager) e responde sempre com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1800
    })
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const msg = data?.error?.message || `HTTP ${resp.status}`;
    const err = new Error(msg);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data?.choices?.[0]?.message?.content || '';
}

module.exports = {
  async execute(input) {
    const { idea, strategy } = input || {};
    const aiMode = (process.env.AI_MODE || 'mock').toLowerCase();

    if (!idea) {
      return generateDefaultProductPlan('Ideia não informada');
    }

    // modo mock (não chama OpenAI)
    if (aiMode !== 'openai') {
      return generateDefaultProductPlan(idea);
    }

    // modo openai
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // sem chave -> fallback
      return generateDefaultProductPlan(idea);
    }

    const prompt = `
Você é um Product Manager expert.

Ideia:
${idea}

Estratégia (JSON):
${JSON.stringify(strategy || {}, null, 2)}

Crie um plano de produto completo e responda APENAS com um JSON VÁLIDO, neste formato:

{
  "description": "",
  "targetAudience": "",
  "mvpFeatures": [],
  "secondaryFeatures": [],
  "architecture": { "frontend": "", "backend": "", "database": "" },
  "userFlows": [],
  "roadmap": [ { "phase": 1, "name": "", "duration": "" } ],
  "successMetrics": []
}
`.trim();

    try {
      const text = await callOpenAI({
        apiKey,
        model: DEFAULT_MODEL,
        prompt
      });

      const parsed = safeJsonParse(text);
      if (parsed) return parsed;

      // se a IA respondeu algo que não é JSON -> fallback
      return generateDefaultProductPlan(idea);

    } catch (error) {
      // quota/429 etc -> fallback
      console.error('Erro ao planejar produto (fallback para default):', error?.message || error);
      return generateDefaultProductPlan(idea);
    }
  }
};