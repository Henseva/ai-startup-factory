module.exports = {
  async execute({ productPlan }) {

    return {
      designStyle: "Minimalista dark mode",
      pages: [
        "Landing Page",
        "Dashboard",
        "Login / Signup",
        "Painel do usuário"
      ],
      components: [
        "Navbar",
        "Cards",
        "Tables",
        "Charts"
      ],
      uiFramework: "React + Tailwind"
    };

  }
};