class Achievement {
  constructor(id, name, desc, unlocked, reward) {
    this.id = id;
    this.name = name;
    this.desc = desc + (reward ? " Reward: " + reward : "");
    this.unlocked = unlocked;
  }

  get isUnlocked() {
    return this.unlocked();
  }

  getAch() {
    if (player.ach.includes(this.id)) return;
    if (this.isUnlocked) {
      player.ach.push(this.id);
      notifyMessage(`[Achievement got!] ${this.name}`);
    }// what is that for //???
  }
}

const achList = [
  new Achievement(0, "Start.", "Buy a Maker.",
    () => Decimal.gt(player.buyables[0], 0)),
  new Achievement(1, "Self-Productive", "Buy a Generator.",
    () => Decimal.gt(player.buyables[1], 0)),
  new Achievement(2, "The Naming System Feels Arbitrary", "Buy a Producer.",
    () => Decimal.gt(player.buyables[2], 0)),
  new Achievement(3, "The Large Production", "Buy a Factory.",
    () => Decimal.gt(player.buyables[4], 0)),
  new Achievement(4, "Multiplied!", "Buy a Booster.",
    () => player.boost.unl),
  new Achievement(5, "Make it shiny!", "Enhance a building twice.",
    () => L1_POLISH.maxamt() >= 2),
  new Achievement(6, "Is this even useful?", "Buy Upgrade 5",
    () => hasUpg(4)),
  new Achievement(7, "The 9th achievement doesn't exist", "Get 9 Boosters.",
    () => Decimal.gte(player.boost.amt, 9)),
  new Achievement(8, "Nonexistent", "Get 99 Makers.",
    () => Decimal.gte(player.buyables[0], 99),
    "Makers produce +9% points faster."),
  new Achievement(9, "The Darkness", "Unlock Dark World.",
    () => L1_CONSUME.unl()),

  new Achievement(10, "Dark Energy", "Get 10,000 Dark Energy.",
    () => D(player.boost.consume.eng).gte(1e4)),
  new Achievement(11, "What Comes Next?", "Reach 20 Boosters.",
    () => Decimal.gte(player.boost.amt, 20)),
  new Achievement(12, "Nerd Boosters", "Get a Booster with under 10 of each Building except Producer.",
    () => false /*handled in 1-booster.js*/,
    "Gain +10% more Points. (additive)"),
  new Achievement(13, "Eight-Packed", "Get all upgrades.",
    () => hasUpg(6)),
  new Achievement(14, "The Summit", "Get all Booster Milestones.",
    () => L1_MILESTONES.unl(10)),
  new Achievement(15, "Uneffective", "Get 10^30 while consuming 6 times.",
    () => D(player.points).gte(1e30) && D(player.boost.consume.amt).gte(6)),
  new Achievement(16, "Mass Production", "Get 99 factories.",
    () => Decimal.gte(player.buyables[4], 99)),
  new Achievement(17, "Precious...", "Enhance a building 8 times.",
    () => L1_POLISH.maxamt() >= 8),
  new Achievement(18, "Gogol Points", "Get 10^50 points.",
    () => Decimal.gte(player.points, 1e50)),
  new Achievement(19, "Time Trial", "Get a Booster in under a minute.",
    () => false /*handled in 1-booster.js*/,
    "Gain +10% more Points. (additive)"),
];


function getAchs() {
  for (const i of achList.values()) i.getAch();
}

function hasAch(x) {
  return player.ach.includes(x)
}

function getAchPower() {
  let r = 1
  if (hasAch(12)) r += 0.1
  if (hasAch(19)) r += 0.1
  return r
}

export function setupAchDOM() {
  document.getElementById("achs").innerHTML =
    "<tr>" + htmlFor(achList, (value, key) => `
    ${key % 10 === 0 ? "</tr><tr>" : ""}
    <td>
      <div 
        class="ach cannotbuy tooltip" 
        id="ach${key}">
        ${value.name}
        <span class="tooltiptext">${value.desc}</span>
      </div>
    </td>
  `) + "</tr>";
}

export function updateAchDOM() {
	tmp.cache.achievements.writeText(player.ach.length)
  for (const key of achList.keys()) {
    updateBuyThings(`ach${key}`, player.ach.includes(key), ["cannotbuy", "completed"]);
  }
}