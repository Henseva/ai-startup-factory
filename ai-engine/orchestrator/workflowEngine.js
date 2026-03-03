class WorkflowEngine {
  constructor() {
    this.steps = [];
  }

  addStep(step) {
    this.steps.push(step);
  }

  getSteps() {
    return this.steps;
  }
}

module.exports = WorkflowEngine;