class Achievement {
  constructor(id, name, desc, unlocked, reward) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.reward = reward;
    this.unlocked = unlocked;
  }

  get isUnlocked() {
    return this.unlocked();
  }

  getAch(force = false) {
    if (player.ach.includes(this.id)) return;
    if (force || this.isUnlocked) {
      player.ach.push(this.id);
      notifyMessage(`[Achievement got!] ${this.name}`);
    }
  }
}

const achList = [
  new Achievement(0, "Start.", "Buy a Maker.",
    () => getBuyable(0).gt(0)),
  new Achievement(1, "Self-Productive", "Buy a Generator.",
    () => getBuyable(1).gt(0)),
  new Achievement(2, "The Naming System Feels Arbitrary", "Buy a Producer.",
    () => getBuyable(2).gt(0)),
  new Achievement(3, "Large Production", "Buy a Factory.",
    () => getBuyable(4).gt(0)),
  new Achievement(4, "Multiplied!", "Buy a Booster.",
    () => layerUnl(1),
    "Permanently keep Upgrade 3."),
  new Achievement(5, "Make it shiny!", "Enhance a building twice.",
    () => L1_POLISH.maxamt() >= 2),
  new Achievement(6, "Is this even useful?", "Buy Upgrade 5",
    () => hasUpg(4,"normal")),
  new Achievement(7, "The 9th achievement doesn't exist", "Get 9 Boosters.",
    () => getBoosters().gte(9)),
  new Achievement(8, "Nonexistent", "Get 99 Makers.",
    () => getBuyable(0).gte(99),
    "Makers produce +9% points faster."),
  new Achievement(9, "The Darkness", "Unlock Dark World.",
    () => L1_CONSUME.unl()),

  new Achievement(10, "Dark Energy", "Get 10,000 Dark Energy.",
    () => L1_CONSUME.eng().gte(1e4)),
  new Achievement(11, "What Comes Next?", "Get 20 Boosters.",
    () => getBoosters().gte(20)),
  new Achievement(12, "Nerd Boosters", "Get a Booster with under 10 of each Building, with the exception of Producers.",
    () => false, /*handled in 1-booster.js*/
    "Gain +10% more Points. (additive)"),
  new Achievement(13, "Seven-Packed", "Get all 7 Point Upgrades.",
    () => hasUpg(6,"normal")),
  new Achievement(14, "The Summit", "Get 40 Boosters.",
    () => getBoosters().gte(40)),
  new Achievement(15, "Uneffective", () => "Get " + format(1e30) + " while consuming 6 times.",
    () => D(player.points).gte(1e30) && L1_CONSUME.amt().gte(6)),
  new Achievement(16, "Mass Production", "Get 99 factories.",
    () => getBuyable(4).gte(99)),
  new Achievement(17, "Precious...", "Enhance a building 9 times.",
    () => L1_POLISH.maxamt() >= 9),
  new Achievement(18, "Gogol Points", () => "Get " + format(1e50) + " points.",
    () => Decimal.gte(player.points, 1e50)),
  new Achievement(19, "One and Only One", () => "Reach " + format(1e25) + " points with only 1 maker.",
    () => Decimal.gte(player.points, 1e25) && getBuyable(0).eq(1) && getBuyable(1).max(getBuyable(2)).max(getBuyable(4)).eq(0),
    "Gain +10% more Points. (additive)"),

  new Achievement(20, "One with the Dark", "Darken the Sun.",
    () => layerUnl(2),
    "Permanently keep Max All."),
  new Achievement(21, "Dark, Darker, Even Darker", "Darken the Sun twice.",
    () => player.dark?.times >= 2),
  new Achievement(22, "Booooooosted", "Perform 100 Booster resets in total.",
    () => player.boost?.times >= 100),
  new Achievement(23, "Enhancement", "Enhance 20 times in total.",
    () => L1_POLISH.totalamt() >= 20,
    "Gain +10% more Points. (additive)"),
  new Achievement(24, "The 25th Achievement!", "Use abilities 25 times.",
    () => (player.dark?.ab?.times ?? 0) >= 25),
  new Achievement(25, "Zoooooom Out!", "Use a Resizer to raise Points by ^1.5.",
    () => false, /*handled in 2-darken.js*/
    "The Resizer efficiency is ^2 instead of ^1.75."),
  new Achievement(26, "Crystallized", "Get 100 Time Crystals.",
    () => D(player.dark?.res?.tc ?? 0).gte(100),
    "Get +10% more Timewarp Power."),
  new Achievement(27, "Total Blackout", "Unlock Dark Alloying.",
    () => hasUpg(7, "dark")),
  new Achievement(28, "Googol Points!", () => "Get " + format(1e100) + " points.",
    () => D(player.points).gte(1e100),
    "Gain +25% more Dark Matter."),
  new Achievement(29, "Lightspeed", "Achieve 50x booster speed.",
    () => getLayer1Speed().gte(50)),

  new Achievement(30, "Challenged", "Unlock Challenges.",
    () => hasUpg(11, "dark"),
    "Get +10% more Dark Resources."),
  new Achievement(31, "Speedrunner", "Darken in 1 minute.",
    () => false, /*handled in 2-darken.js*/
    "Get +10% more Timewarp Power."),
  new Achievement(32, "Boostless", "Darken with 25 boosters or less.",
    () => false, /*handled in 2-darken.js*/
    "Get +10% more Timewarp Power."),
  new Achievement(33, "Bravery", "Complete 15 total challenges.",
    () => chalComps(1) + chalComps(2) + chalComps(3) + chalComps(4) + chalComps(5) + chalComps(6) >= 15),
  new Achievement(34, "Where's my Infinity?", () => "Get " + format(Number.MAX_VALUE) + " points.",
    () => D(player.points).gte(Number.MAX_VALUE)),
  new Achievement(35, "Challenges don't work like that...", "Darken in Challenges.",
    () => false), /*handled in 2-darken.js*/
  // more coming soon in v0.3: Elemental
];
const achRows = [
  () => true,
  () => L1_CONSUME.unl() || tmp.layer >= 2,
  () => tmp.layer >= 2,
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
        <span class="tooltiptext" id="achdesc${key}"></span>
      </div>
    </td>
  `) + "</tr>"; // how the hell do i make achievements background bruv
}

function updateAchDOM() {
	tmp.cache.achievements.writeText(player.ach.length)
	tmp.cache.achTotal.writeText(achList.length)
	tmp.cache.achPercent.writeText(format(player.ach.length / achList.length * 100))

  let rows = Array(Math.ceil(achList.length / 10)).fill(0)
  for (const key of player.ach.keys()) rows[Math.floor(player.ach[key] / 10)]++

  for (const key of achList.keys()) {
    let data = achList[key]
    let has = player.ach.includes(key)
    let row = Math.floor(key / 10)
    tmp.cache[`ach${key}`][
      (!has ? "add" : "remove") + "Classes"
    ]("cannotbuy");
    tmp.cache[`ach${key}`][
      (has && player.ach.length < achList.length && rows[row] < 10 ? "add" : "remove") + "Classes"
    ]("completed");
    tmp.cache[`ach${key}`][
      (has && player.ach.length < achList.length && rows[row] == 10 ? "add" : "remove") + "Classes"
    ]("rowDone"); //now add an option to remove all completed rows
    tmp.cache[`ach${key}`][
      (has && player.ach.length == achList.length ? "add" : "remove") + "Classes"
    ]("allDone");
    tmp.cache[`achdesc${key}`].writeText(evalVal(data.desc) + (data.reward ? " Reward: " + data.reward : ""))

    if (key > 0 && key % 10 == 0) tmp.cache[`achrow${key/10}`].changeStyle("display", achRows[row]() || rows[row - 1] >= 7 ? "" : "none")
  }
}
