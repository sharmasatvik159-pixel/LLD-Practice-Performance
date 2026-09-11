'use strict';

class Evaluator {
  constructor(type) {
    if (!type) {
      throw new Error('Evaluator: type is required.');
    }

    this.type = type;
  }

  evaluate() {
    throw new Error(
      'Evaluator: evaluate() must be implemented by a subclass.'
    );
  }

  getType() {
    return this.type;
  }
}

module.exports = Evaluator;