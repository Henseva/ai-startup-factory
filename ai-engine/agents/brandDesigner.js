module.exports = {
  async execute({ startupName }) {

    return {
      brandName: startupName,
      logoConcept: "Logo minimalista tecnológico",
      colors: ["#0b0b10", "#ffd54a"],
      typography: "Inter / Sans-serif moderna",
      toneOfVoice: "Tecnológico, moderno e confiável"
    };

  }
};