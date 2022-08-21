const NaNPath = Symbol("NaNPath");
const playerHandler = {
  get(target, key) {
    const value = target[key];
    if (
      value &&
      !value[NaNPath] &&
      (value.constructor === Object || Array.isArray(value))
    ) {
      value[NaNPath] = `${target[NaNPath]}.${key}`;
      target[key] = new Proxy(value, playerHandler);
    }
    return value;
  },
  set(target, key, value) {
    try {
      if (
        Number.isNaN(value) ||
        (value instanceof Decimal && Decimal.isNaN(value))
      )
        throw `Attempted to set ${target[NaNPath]}.${key} to NaN value`;

      target[key] = value;
      return true;
    } catch (e) {
      clearInterval(interval);
      canSave = false;

      console.warn(
        "Attempted to set a NaN value. See above, and go fix those formulas."
      );
      console.error(e);
    }
  },
};
const pointGainBoostingThings = {
  upgrades: [0, 1, 6],
  buyables: BUYABLE_KEYS.filter((id) => {
    return ![3, 5].includes(id);
  }),
};
let player = {};

function setup() {
  return {
    ver,
    points: D(10),
    creatorPower: D(0),
    buyables: Array(6).fill(D(0)),
    upgrades: {},
    ach: [],

    //AUTOMATION
    //i'll restructure these later.
    automationtoggle: true,
    autoBooster: false,
    autoUpgrades: true,
    enhancePriority: {},
    toningPriority: {},

    //STATS
    stats: {
      time: 0,
      max: D(0),
    },
    lastTick: Date.now(),

    //TAB
    stab: {},
    modes: {},

    //SETINGS
    theme: "default",
    icon: "default",
    notation: "mix",
    music: false,
    news: false,
    tickers: 0,
    wannacry: false,
    hasWon: false,
    offline: {},
    [NaNPath]: "player",
  };
}

function production() {
  let gain = D(0);
  if (inChal(1)) gain = D(1);
  else
    for (const id of pointGainBoostingThings.buyables) {
      if (id != "3") gain = gain.add(buyables[id].prod());
    }

  gain = gain.mul(getAchPower());
  gain = gain.mul(buyables[3].prod());
  for (const id of pointGainBoostingThings.upgrades) {
    if (hasUpg(id, "normal"))
      gain = gain.mul(UPGRADES.normal.list[id].effect());
  }
  if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[2]);
  if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[3]);
  if (hasUpg(0, "dark")) gain = gain.mul(5);
  if (hasUpg(3, "dark")) gain = gain.mul(UPGRADES.dark.list[3].effect());

  if (player.modes.diff === 0) gain = gain.times(3);
  if (player.modes.diff === 1) gain = gain.times(2);
  if (inChal(5)) gain = gain.pow(0.75);
  return gain;
}

function inStartGameScreen() {
  return player.modes.diff === undefined;
}

function gameEnded() {
  return !ver.beta && hasChaReward(6, 0);
}

function inEndGameScreen() {
  return gameEnded() && !player.hasWon;
}

//FUTURE
function layer_placeholder(x) {
  return false;
}

document.onkeypress = function (event) {
  if (player.wannacry) {
    notifyMessage("Hotkeys are disabled in wannacry mode");
  } else {
    switch (event.key) {
      case "m":
        buyMaxBuyables();
        break;
      case "a":
        let bool = false;
        if (
          !player.automationtoggle ||
          !player.autoUpgrades ||
          !player.autoBooster
        )
          bool = true;
        player.automationtoggle = bool;
        player.autoUpgrades = bool;
        player.autoBooster = bool;
      case "1":
        if (hasUpg(2, "dark")) L2_ABILITY.resize.use();
        break;
      case "2":
        if (hasUpg(2, "dark")) L2_ABILITY.time.jump();
        break;
      case "3":
        if (hasUpg(2, "dark")) L2_ABILITY.time.speed();
        break;
      case "b":
        buyBuyable(3);
        break;
      case "d":
        doLayer2();
        break;
      default:
        break;
    }
  }
};
