module.exports = {
  async execute({ productPlan, uiDesign }) {

    return {
      framework: "React / Next.js",
      pages: [
        "Home",
        "Dashboard",
        "Settings"
      ],
      stateManagement: "React Context",
      styling: "TailwindCSS"
    };

  }
};