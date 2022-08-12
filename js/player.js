const playerHandler = {
  get(target, key) {
    const value = target[key];
    if (value && !value[NaNToken] && (value.constructor === Object || Array.isArray(value))) {
      value[NaNToken] = `${target[NaNToken]}.${key}`;
      target[key] = new Proxy(value, playerHandler);
    }
    return value;
  },
  set(target, key, value) {
    if (
      Number.isNaN(value) ||
      (value instanceof Decimal && Decimal.isNaN(value))
    ) {
      console.warn(`Attempted to set ${target[NaNToken]}.${key} to NaN value`);
      clearInterval(saveInterval);
      clearInterval(interval);
      throw new Error("Attempted to set a NaN value. See above, and go fix those formulas.");
    }
    target[key] = value;
    return true;
  }
};
const NaNToken = Symbol("NaNPath");

function setup() {
	return {
    points: D(10),
    creatorPower: D(0),
    buyables: Array(6).fill(D(0)),
    upgrades: {},
    abilities: {
      total: 0,
      cd: {},
    },

    boost: setupLayer1(),
    dark: setupLayer2(),
	
		ach: [],
    stats: {
      time: 0,
      max: D(0),
    },
    enhancePriority: {},
    toningPriority: {},
    theme: "default",
    news: false,
    linearNews: true,
    automationtoggle: true,
    autoBooster: false,
    autoUpgrades: true,
    wannacry: false,
    music: false,
    tickers: 0,
    lastTick: Date.now(),
    tab: "main",
    stab: {
      main: "upg",
      stats: "l1",
      settings: "main",
			dark: "upg",
    },
    hasWon: false,
    ver: ver,
    [NaNToken]: "player"
	}
}
let player = new Proxy(setup(), playerHandler);

const pointBoostingUpgsIds = [0, 1, 6];

function production() {
  let gain = new Decimal(0)
  for (const id of BUYABLE_KEYS) {
    if (id !== "3" && id !== "5") gain = gain.add(buyables[id].prod())
  }
  gain = gain.mul(getAchPower());
	gain = gain.mul(buyables[3].prod());
  for (const u of pointBoostingUpgsIds) {
    if (hasUpg(u,"normal")) gain = gain.mul(upgrades.normal.list[u].effect());
  }
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[2]);
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[3]);
  if (hasUpg(0, "dark")) gain = gain.mul(5);
  if (hasUpg(3, "dark")) gain = gain.mul(upgrades.dark.list[3].effect());
  return gain;
}

function gameEnded() {
  return !ver.beta && hasUpg(11, "dark")
}

function inEndGameScreen() {
  return gameEnded() && !player.hasWon
}

//FUTURE
function layer_placeholder(x) {
	return false
}

document.onkeypress = function(e) {
    if (player.wannacry) {
      notifyMessage("Hotkeys are disabled in wannacry mode")
    } else {
      switch (e.key){
        case "m":
          buyMaxBuyables();
          break;
        case "b":
          buyBuyable(3);
          break;
        case "d":
          doLayer2();
          break;
        default: break;
      }
    }
}