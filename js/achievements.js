class Achievement {
  constructor(id, name, desc, unlocked, reward) {
    this.id = id;
    this.name = name;
    this.desc = desc + (reward ? ` Reward: ${reward}` : "");
    this.unlocked = unlocked;
  }

  get isUnlocked() {
    return this.unlocked();
  }

  getAch(force=false) {
    if (player.ach.includes(this.id)) return;
    if(!player.boost.unl) return;
    if (force || this.isUnlocked) {
      player.ach.push(this.id);
      notifyMessage(`[Achievement got!] ${this.name}`);
    }
  }
}

const achList = [
  new Achievement(0, "Start.", "Buy a Maker.",
    () => Decimal.gt(player.buyables[0], 0)),
  new Achievement(1, "Self-Productive", "Buy a Generator.",
    () => Decimal.gt(player.buyables[1], 0)),
  new Achievement(2, "The Naming System Feels Arbitrary", "Buy a Producer.",
    () => Decimal.gt(player.buyables[2], 0)),
  new Achievement(3, "Large Production", "Buy a Factory.",
    () => Decimal.gt(player.buyables[4], 0)),
  new Achievement(4, "Multiplied!", "Buy a Booster.",
    () => player.boost.unl),
  new Achievement(5, "Make it shiny!", "Enhance a building twice.",
    () => L1_POLISH.maxamt() >= 2),
  new Achievement(6, "Is this even useful?", "Buy Upgrade 5",
    () => hasUpg(4,"normal")),
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
    () => false, /*handled in 1-booster.js*/
    "Gain +10% more Points. (additive)"),
  new Achievement(13, "Seven-Packed", "Get all 7 Point Upgrades.",
    () => hasUpg(6,"normal")),
  new Achievement(14, "The Summit", "Get 40 Boosters.",
    () => D(player.buyables[3]).gte(40)),
  new Achievement(15, "Uneffective", "Get 10^30 while consuming 6 times.",
    () => D(player.points).gte(1e30) && D(player.boost.consume.amt).gte(6)),
  new Achievement(16, "Mass Production", "Get 99 factories.",
    () => Decimal.gte(player.buyables[4], 99)),
  new Achievement(17, "Precious...", "Enhance a building 8 times.",
    () => L1_POLISH.maxamt() >= 8),
  new Achievement(18, "Gogol Points", "Get 10^50 points.",
    () => Decimal.gte(player.points, 1e50)),
  new Achievement(19, "Time Trial", "Get a Booster in under a minute.",
    () => false, /*handled in 1-booster.js*/
    "Gain +10% more Points. (additive)"),

  new Achievement(20, "One with the Dark", "Darken the Sun.",
    () => player.dark.unl),
  new Achievement(21, "Dark, Darker, Even Darker", "Darken the Sun twice.",
    () => player.dark.times >= 2),
  new Achievement(22, "Booooooosted", "Perform 100 Booster resets in total.",
    () => player.boost.times >= 100),
  new Achievement(23, "Enhancement", "Enhance 20 times in total.",
    () => L1_POLISH.totalamt() >= 20,
    "Gain +10% more Points. (additive)"),
  new Achievement(24, "The 25th Achievement!", "Use abilities 25 times.",
    () => player.abilities.total >= 25),
  new Achievement(25, "Zoooooom Out!", "Use a Resizer to raise Points by ^1.5.",
    () => false, /*handled in 2-darken.js*/
    "The Resizer efficiency is ^2 instead of ^1.75."),
  new Achievement(26, "Crystallized", "Get 100 Time Crystals.",
    () => D(player.dark.res.tc || 0).gte(100),
    "Get +10% more Timewarp Power."),
  new Achievement(27, "Total Blackout", "Unlock Dark Alloying.",
    () => hasUpg(7, "dark")),
  new Achievement(28, "Googol Points!", "Get 10^100 points.",
    () => D(player.points).gte(1e100),
    "Gain +25% more Dark Matter."),
  new Achievement(29, "Lightspeed", "Achieve 100x timewarp power.",
    () => L2_ABILITY.time.power().gte(100)),

  new Achievement(30, "Challenged", "Unlock Challenges.",
    () => hasUpg(11, "dark"),
    "Get +10% more Dark Resources."),
  new Achievement(31, "Speedrunner", "Darken in 1 minute.",
    () => false, /*handled in 2-darken.js*/
    "Get +10% more Timewarp Power."),
  new Achievement(32, "Boostless", "Darken with 25 boosters or less.",
    () => false, /*handled in 2-darken.js*/
    "Get +10% more Timewarp Power."),
];
const achRows = [
  () => true,
  () => L1_CONSUME.unl() || player.dark.unl,
  () => player.dark.unl,
  () => hasUpg(11, "dark")
]

function getAch(x) {
  achList[x].getAch(true)
}

function getAchs() {
  for (const value of achList.values()) value.getAch()
}

function hasAch(x) {
  return player.ach.includes(x)
}

function getAchPower() {
  let power = 1;
  if (hasAch(12)) power += 0.1;
  if (hasAch(19)) power += 0.1;
  if (hasAch(23)) power += 0.1;
  return power;
}

function setupAchDOM() {
  document.getElementById("achs").innerHTML =
    "<tr>" + htmlFor(achList, (value, key) => `
    ${key % 10 === 0 ? `</tr><tr id="achrow${key/10}">` : ""}
    <td>
      <div 
        class="ach cannotbuy tooltip" 
        id="ach${key}">
        ${value.name}
        <span class="tooltiptext">${value.desc}</span>
      </div>
    </td>
  `) + "</tr>"; // how the hell do i make achievements background bruv
}

function updateAchDOM() {
	tmp.cache.achievements.writeText(player.ach.length)
	tmp.cache.achTotal.writeText(achList.length)
	tmp.cache.achPercent.writeText(format(player.ach.length / achList.length * 100))

  let rows = [0, 0, 0, 0]
  for (const key of player.ach.keys()) rows[Math.floor(player.ach[key] / 10)]++

  for (const key of achList.keys()) {
    let has = player.ach.includes(key)
    let row = Math.floor(key / 10)
    tmp.cache[`ach${key}`][
      (!has ? "add" : "remove") + "Classes"
    ]("cannotBuy");
    tmp.cache[`ach${key}`][
      (has && player.ach.length < achList.length && rows[row] < 10 ? "add" : "remove") + "Classes"
    ]("completed");
    tmp.cache[`ach${key}`][
      (has && player.ach.length < achList.length && rows[row] == 10 ? "add" : "remove") + "Classes"
    ]("rowDone"); //now add an option to remove all completed rows
    tmp.cache[`ach${key}`][
      (has && player.ach.length == achList.length ? "add" : "remove") + "Classes"
    ]("allDone");

    if (key % 10 == 0) tmp.cache[`achrow${key/10}`].changeStyle("display", achRows[row]() ? "" : "none")
  }
}