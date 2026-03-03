/**
 * AI Orchestrator
 * Coordena múltiplos agentes de IA para criar produtos completos
 * Gerencia o fluxo de trabalho e execução de tarefas
 */

const WorkflowEngine = require('./workflowEngine');
const TaskManager = require('./taskManager');

// Importar agentes especializados
const productPlanner = require('../agents/productPlanner');
const marketResearchAgent = require('../agents/marketResearchAgent');
const startupStrategist = require('../agents/startupStrategist');
const brandDesigner = require('../agents/brandDesigner');
const uiDesigner = require('../agents/uiDesigner');
const databaseArchitect = require('../agents/databaseArchitect');
const backendEngineer = require('../agents/backendEngineer');
const frontendEngineer = require('../agents/frontendEngineer');
const contentWriter = require('../agents/contentWriter');
const seoOptimizer = require('../agents/seoOptimizer');
const automationBuilder = require('../agents/automationBuilder');
const chatbotBuilder = require('../agents/chatbotBuilder');
const deploymentManager = require('../agents/deploymentManager');

class AIOrchestrator {
  constructor() {
    this.workflowEngine = new WorkflowEngine();
    this.taskManager = new TaskManager();
    this.agents = {
      productPlanner,
      marketResearchAgent,
      startupStrategist,
      brandDesigner,
      uiDesigner,
      databaseArchitect,
      backendEngineer,
      frontendEngineer,
      contentWriter,
      seoOptimizer,
      automationBuilder,
      chatbotBuilder,
      deploymentManager,
    };
  }

  /**
   * Inicia o processo de criação de um novo projeto
   * @param {string} userIdea - Descrição da ideia do usuário
   * @param {object} userPreferences - Preferências do usuário
   * @returns {Promise<object>} - Projeto completo gerado
   */
  async createStartup(userIdea, userPreferences = {}) {
    console.log('🚀 Iniciando criação de startup:', userIdea);

    try {
      // Etapa 1: Pesquisa de Mercado
      const marketResearch = await this.executeAgent('marketResearchAgent', {
        idea: userIdea,
        preferences: userPreferences,
      });

      // Etapa 2: Estratégia de Startup
      const startupStrategy = await this.executeAgent('startupStrategist', {
        idea: userIdea,
        marketResearch,
        preferences: userPreferences,
      });

      // Etapa 3: Planejamento de Produto
      const productPlan = await this.executeAgent('productPlanner', {
        idea: userIdea,
        strategy: startupStrategy,
      });

      // Etapa 4: Design de Marca
      const brandIdentity = await this.executeAgent('brandDesigner', {
        startupName: startupStrategy.startupName,
        productPlan,
        marketResearch,
      });

      // Etapa 5: Design de UI/UX
      const uiDesign = await this.executeAgent('uiDesigner', {
        productPlan,
        brandIdentity,
      });

      // Etapa 6: Arquitetura de Banco de Dados
      const databaseSchema = await this.executeAgent('databaseArchitect', {
        productPlan,
        features: productPlan.features,
      });

      // Etapa 7: Backend Engineering
      const backendCode = await this.executeAgent('backendEngineer', {
        productPlan,
        databaseSchema,
        features: productPlan.features,
      });

      // Etapa 8: Frontend Engineering
      const frontendCode = await this.executeAgent('frontendEngineer', {
        productPlan,
        uiDesign,
        features: productPlan.features,
      });

      // Etapa 9: Conteúdo
      const content = await this.executeAgent('contentWriter', {
        startupName: startupStrategy.startupName,
        productPlan,
        brandIdentity,
      });

      // Etapa 10: SEO Optimization
      const seoOptimization = await this.executeAgent('seoOptimizer', {
        content,
        productPlan,
      });

      // Etapa 11: Automações
      const automations = await this.executeAgent('automationBuilder', {
        productPlan,
        features: productPlan.features,
      });

      // Etapa 12: Chatbots
      const chatbots = await this.executeAgent('chatbotBuilder', {
        productPlan,
        content,
      });

      // Etapa 13: Deployment
      const deploymentConfig = await this.executeAgent('deploymentManager', {
        backendCode,
        frontendCode,
        databaseSchema,
      });

      // Compilar projeto completo
      const completeProject = {
        metadata: {
          startupName: startupStrategy.startupName,
          createdAt: new Date().toISOString(),
          status: 'generated',
        },
        strategy: startupStrategy,
        marketResearch,
        productPlan,
        brandIdentity,
        uiDesign,
        databaseSchema,
        backendCode,
        frontendCode,
        content,
        seoOptimization,
        automations,
        chatbots,
        deploymentConfig,
      };

      console.log('✅ Projeto criado com sucesso!');
      return completeProject;
    } catch (error) {
      console.error('❌ Erro ao criar startup:', error);
      throw error;
    }
  }

  /**
   * Executa um agente específico com dados de entrada
   * @param {string} agentName - Nome do agente
   * @param {object} input - Dados de entrada
   * @returns {Promise<object>} - Resultado da execução
   */
  async executeAgent(agentName, input) {
    const agent = this.agents[agentName];
    if (!agent) throw new Error(`Agente não encontrado: ${agentName}`);

    console.log(`📊 Executando agente: ${agentName}`);
    return await agent.execute(input);
  }

  async optimizeProject(project) {
    console.log('🔧 Otimizando projeto...');
    return project;
  }
}

module.exports = AIOrchestrator;