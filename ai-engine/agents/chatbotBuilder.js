module.exports = {
  async execute({ productPlan }) {

    return {
      chatbotType: "Assistente de suporte",
      capabilities: [
        "Responder dúvidas",
        "Guiar usuários no onboarding",
        "Resolver problemas comuns"
      ]
    };

  }
};