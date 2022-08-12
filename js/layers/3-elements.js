// hi player! If you're reading this, be the first to tell us and you'll get beta tester (or 0.25 of a personal role)!

class Element {
  constructor(name,cost,descendants,effect,effectdisplay) {
    this.name = name;
    this.cost = cost;
    this.descendants = descendants;
    this.effect = effect;
    this.effectdisplay = effectdisplay;
    this.bought = false;
  }
  
  get isUnlocked() {
    return this.unlocked();
  }
  
  canBuy() {
    return player.points.gte(this.cost);
  }
  
  
}