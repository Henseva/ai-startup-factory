module.exports = {
  async execute({ productPlan }) {

    return {
      database: "PostgreSQL",
      tables: [
        "users",
        "projects",
        "subscriptions",
        "logs"
      ],
      relationships: [
        "users -> projects",
        "users -> subscriptions"
      ],
      scalingStrategy: "Indexação + replicação futura"
    };

  }
};