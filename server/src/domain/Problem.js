/**
 * domain/Problem.js
 *
 * Represents an LLD challenge that a learner can practice.
 *
 * Responsibility:
 *   Hold all information describing the challenge.
 *   Nothing more.
 *
 * Deliberately does NOT:
 *   - evaluate submissions
 *   - manage attempts
 *   - call any external API
 */

'use strict';

/** Valid difficulty levels for a Problem. */
const Difficulty = Object.freeze({
  EASY:   'Easy',
  MEDIUM: 'Medium',
  HARD:   'Hard',
});

class Problem {
  /**
   * @param {object} params
   * @param {string}   params.id           - Unique slug, e.g. "parking-lot"
   * @param {string}   params.title        - Human-readable name, e.g. "Parking Lot"
   * @param {string}   params.description  - Full problem statement shown to learner
   * @param {string}   params.difficulty   - One of Difficulty.*
   * @param {string[]} params.requirements - Bullet-point requirements for this problem
   */
  constructor({ id, title, description, difficulty, requirements }) {
    if (!id || !title || !description || !difficulty || !requirements) {
      throw new Error('Problem: all fields (id, title, description, difficulty, requirements) are required.');
    }

    if (!Object.values(Difficulty).includes(difficulty)) {
      throw new Error(`Problem: difficulty must be one of ${Object.values(Difficulty).join(', ')}.`);
    }

    this.id           = id;
    this.title        = title;
    this.description  = description;
    this.difficulty   = difficulty;
    this.requirements = requirements; // string[]
  }

  /**
   * Returns the full problem detail object — used by the problem detail page.
   * @returns {object}
   */
  getDetails() {
    return {
      id:           this.id,
      title:        this.title,
      description:  this.description,
      difficulty:   this.difficulty,
      requirements: this.requirements,
    };
  }

  /**
   * Returns only the requirements list — used by evaluators to
   * cross-check whether the learner addressed all stated requirements.
   * @returns {string[]}
   */
  getRequirements() {
    return this.requirements;
  }

  /** Returns a plain object safe to send over the wire. */
  toJSON() {
    return this.getDetails();
  }
}

module.exports = { Problem, Difficulty };
