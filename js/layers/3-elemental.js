const ELEMENTAL = (LAYERS[3] = {
  name: "Elemental",
  pharse: "???",
  confirm: "Are you sure?",
  ani() {
    return layerNotify(3);
  },
  loc: "elem",
  setup() {
    return {};
  },

  can() {
    return false;
  },

  reset() {
    player.dark.res = {
      dm: D(0),
    };
    player.dark.upg = {};
    player.dark.ab.cd = {};

    delete player.dark.ab.speed;
    delete player.dark.ab.jump;
    delete player.dark.chal;
    updateChalIn();
  },
  onReset() {},
});

// hi player! If you're reading this, be the first to tell us and you'll get beta tester (or 0.25 of a personal role)!

class Element {
  constructor(name, cost, descendants, effect, effectdisplay) {
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
