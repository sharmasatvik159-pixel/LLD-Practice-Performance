'use strict';

class Rubric {
  constructor({ id, name, criteria }) {
    if (!id || !name || !Array.isArray(criteria)) {
      throw new Error(
        'Rubric: id, name, and criteria array are required.'
      );
    }

    this.id = id;
    this.name = name;
    this.criteria = criteria;
  }

  getCriterion(criterionId) {
    const criterion = this.criteria.find(
      (criterion) => criterion.id === criterionId
    );

    if (!criterion) {
      throw new Error(
        `Rubric: criterion "${criterionId}" not found.`
      );
    }

    return criterion;
  }

  getCriteria() {
    return this.criteria;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      criteria: this.criteria
    };
  }
}

module.exports = Rubric;