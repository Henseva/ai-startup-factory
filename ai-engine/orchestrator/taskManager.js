class TaskManager {
  constructor() {
    this.tasks = [];
  }

  add(task) {
    this.tasks.push({ ...task, createdAt: new Date().toISOString() });
  }

  list() {
    return this.tasks;
  }
}

module.exports = TaskManager;