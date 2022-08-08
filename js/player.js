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
    buyables: {
      0: D(0),
      1: D(0),
      2: D(0),
			3: D(0),
			4: D(0)
    },
    upgrades: {},

    boost: setupLayer1(),
    dark: setupLayer2(),
	
		ach: [],
    stats: {
      time: 0,
      max: D(0),
    },
    theme: "default",
    news: false,
    linearNews: true,
    automationtoggle: true,
    lastTick: Date.now(),
    tab: "main",
    stab: {
      main: "upg",
      stats: "l1",
      settings: "main",
			dark: "upg",
    },
    hasWon: false,
    ver: 0.1,

    [NaNToken]: "player"
	}
}

let player = new Proxy(setup(), playerHandler);

const pointBoostingUpgsIds = [0, 1, 6];

function production() {
  let gain = new Decimal(0)
  for (const id in buyables) {
    if (id !== "3") gain = gain.add(buyables[id].prod())
  }
  gain = gain.mul(getAchPower());
	gain = gain.mul(buyables[3].prod());
  for (const u of pointBoostingUpgsIds) {
    if (hasUpg(u,"normal")) gain = gain.mul(upgrades.normal.list[u].effect());
  }
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[2]);
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[3]);
  if (hasUpg(0, "dark")) gain = gain.mul(5);
  return gain;
}

function gameEnded() {
  return hasUpg(2, "dark")
}

function inEndGameScreen() {
  return gameEnded() && !player.hasWon
}

//FUTURE
function layer_placeholder(x) {
	return false
}

document.onkeypress = function (e) {
    switch (e.key){
			case "m":
				buyMaxBuyables();
				break;
      case "b":
        // doLayer1Reset();
        break;
		}	
};

const autoInterval = setInterval(function () {
  if ((L1_MILESTONES.unl(6) || hasUpg(1, "dark")) && player.automationtoggle) {
    buyMaxBuyables();
    if (L1_MILESTONES.unl(10)) for (let i = 0; i <= 6; i++) buyUpg(i, "normal");
  }
}, 2000);