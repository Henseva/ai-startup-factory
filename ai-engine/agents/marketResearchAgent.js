module.exports = {
  async execute({ idea }) {

    return {
      summary: `Pesquisa de mercado simulada para: ${idea}`,
      marketSize: "Mercado estimado em crescimento",
      competitors: [
        "Concorrente A",
        "Concorrente B",
        "Concorrente C"
      ],
      opportunities: [
        "Automação de processos",
        "Mercado ainda pouco explorado"
      ],
      risks: [
        "Entrada de grandes players",
        "Mudanças tecnológicas rápidas"
      ]
    };

  }
};