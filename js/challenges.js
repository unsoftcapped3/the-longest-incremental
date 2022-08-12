class Challenge {
  constructor(id, name, description, challengeEffect, effect, resets, completionsFormula) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.challengeEffect = challengeEffect;
    this.effect = effect;
    this.resets = resets;
    this.completionsFormula = completionsFormula
    this.completions = 0;
    this.inChallenge = false;
    this.challengeImage = imageMap(`c${this.id}`);
  }
  
  resetVariables() {
    if (this.resets === "booster") {
      doLayer1Reset(true);
    } else if (this.resets === "darken") {
      doLayer2Reset(true);
    }
  }
  
  toggleChallenge() {
    this.inChallenge = !this.inChallenge;
    if (!this.inChallenge) {
      if (this.completionsFormula().toNumber() > 1) {
        this.completions++;
      }
    }
    this.resetVariables();
  }
  
}