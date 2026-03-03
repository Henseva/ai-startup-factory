module.exports = {
  async execute({ idea, strategy }) {

    return {
      productName: strategy?.startupName || "AI Product",
      description: `Produto baseado na ideia: ${idea}`,
      features: [
        "Dashboard inteligente",
        "Sistema de autenticação",
        "Gestão de usuários",
        "Integração com APIs",
        "Analytics em tempo real"
      ],
      mvpScope: [
        "Cadastro de usuários",
        "Funcionalidade principal",
        "Dashboard básico"
      ],
      estimatedBuildTime: "30 dias"
    };

  }
};