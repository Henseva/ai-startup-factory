module.exports = {
  async execute({ productPlan }) {

    return {
      automations: [
        "Email de boas-vindas",
        "Notificação de atividade",
        "Relatório semanal automático"
      ]
    };

  }
};