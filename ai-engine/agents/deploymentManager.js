module.exports = {
  async execute({ backendCode, frontendCode }) {

    return {
      hosting: "Vercel / Render",
      ciCd: "GitHub Actions",
      environment: [
        "NODE_ENV",
        "DATABASE_URL",
        "JWT_SECRET"
      ],
      deploymentSteps: [
        "Build frontend",
        "Deploy backend",
        "Configurar domínio"
      ]
    };

  }
};