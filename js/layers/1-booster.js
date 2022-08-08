function doLayer1Reset(force) {
  if (canAffordBuyable(3)) force = false;
  if (!force) {
    if (player.boost.times === 0) {
      player.boost.unl = true;
      notify();
    }
    if (
      D(player.buyables[0])
        .max(player.buyables[1])
        .max(player.buyables[4])
        .max(player.buyables[5])
        .lt(10)
    )
      achList[12].getAch();
    if (player.boost.time < 60) achList[19].getAch();
    player.boost.times++;
    player.boost.amt = player.buyables[3];
  } else player.boost.restart++;

  player.boost.time = 0;

  player.points = D(10);
  Object.keys(player.buyables).forEach(
    (x) => x !== "3" && (player.buyables[x] = D(0))
  );
  Object.keys(player.upgrades).forEach(
    (x) => x !== "2" && (player.upgrades[x] = 0) // DO NOT PUT SEMICOLON HERE
  );
}

function setupLayer1() {
  let s = {
    confirm: true,
    time: 0,
    times: 0,
    restart: 0,
    maxPoints: D(0),
    amt: D(0),
    unl: false,
    // this is not defined??????
    // bruh this is just array but mimics object
    bu: { 0: D(0), 1: D(0), 2: D(0) },
    consume: {
      amt: D(0),
      eng: D(0),
      upg: {},
    },
  };
  return s;
}

//BOOSTER MILESTONES
const L1_MILESTONES = {
  unl(x) {
    return Decimal.gte(player.boost.amt, L1_MILESTONES.data[x].req);
  },
  setupDOM() {
    document.getElementById("milestones").innerHTML = htmlFor(
      this.data,
      (value, key) => `
			<tr id="milestoneDisplay${key}">
				<td style='text-align: left; width: 240px'><b>${formatWhole(
          value.req
        )} Boosters</b>:</td>
				<td>${value.desc}</td>
			</tr>`
    );
  },
  updateDOM() {
    for (const milestone of Object.keys(this.data)) {
      updateBuyThings(
        `milestoneDisplay` + milestone,
        Decimal.gte(player.boost.amt, this.data[milestone].req),
        ["cannotbuy", "bought"]
      );
    }
    //${L1_MILESTONES.unl(key)?"(Done)":"(Not done)"}
  },
  data: {
    0: {
      req: D(2),
      desc: "Unlock the ability to respec Enhances.",
    },
    1: {
      req: D(3),
      desc: "Triple Generator Production.",
    },
    2: {
      req: D(4),
      desc: "Upgrade 1 has a better formula.",
    },
    3: {
      req: D(5),
      desc: "Enhancements are 25% cheaper.",
    },
    4: {
      req: D(6),
      desc: "Unlock Building 4: Factory.",
    },
    5: {
      req: D(8),
      desc: "Raise Upgrade 1's effect to the power of 1.3.",
    },
    6: {
      req: D(10),
      desc: "Unlock Automation.",
    },
    7: {
      req: D(15),
      desc: "Unlock the Dark World.",
    },
    8: {
      req: D(20),
      desc: "Factory Enhances cheapen Buyables.",
    },
    9: {
      req: D(30),
      desc: "Consumption consumes less Boosters.",
    },
    10: {
      req: D(40),
      desc: "Automate Point Upgrades.",
    },
  },
};

//ENHANCEMENTS: By Aarex
//formerly Building Boosters and Polishments
let L1_POLISH = {
  unl(x) {
    if (x == 3) return player.dark.unl;
    return player.boost.unl;
  },
  updateDOM() {
    tmp.cache.polish_respec.changeStyle(
      "display",
      L1_MILESTONES.unl(0) ? "" : "none"
    );
    tmp.cache.buyableBoost.writeText(
      player.boost.unl ? `Boosters left: ${format(L1_POLISH.unspent())}` : ""
    );
    for (const key of BUYABLE_KEYS) {
      tmp.cache[`buyableBoostDiv${key}`].changeStyle(
        "display",
        this.unl(key) ? "table-row" : "none"
      );
      tmp.cache[`buyableBoost${key}`].writeText(
        this.amt(key) === 13
          ? "(Max)"
          : `(${this.amt(key)}) Enhance: ${format(this.cost(key))} Boosters`
      );
      updateBuyThings(`buyableBoost${key}`, this.can(key));
      tmp.cache[`buyableFlat${key}`].writeText(format(this.flat(key)));
      tmp.cache[`buyableRepeated${key}`].writeText(format(this.perLvl(key)));
    }
  },
  eff(x) {
    if (x == 3) {
      if (this.flat(3) == 14) return 0.25;
      return (1 - 1 / this.flat(3)) / 4;
    } else {
      let r = D(1);
      r = r.mul(this.flat(x)); //Effect 1: Multiplication
      r = r.mul(D(2).pow(Decimal.div(getBuyable(x), this.perLvl(x)).floor())); //Effect 2: Per-Level Boost
      return r;
    }
  },
  perLvl(x) {
    let amt = this.amt(x);
    if (amt === 0) return Infinity;
    return (
      [0, 6, 5.5, 5, 4.5, 4, 3.75, 3.5, 3.25, 3, 2.75, 2.5, 2.25, 2][
        Math.min(13, amt)
      ] / Math.log2([1.4, 1.6, 1.8, 0, 2][x])
    );
  },

  unspent() {
    return Decimal.sub(player.boost.amt, this.total());
  },
  costMul(x) {
    let r = 1;
    if (x == 3) r *= 10;
    if (L1_MILESTONES.unl(3)) r = 0.75;
    if (L1_CONSUME.unl()) r /= tmp.darkTones[3];
    return r;
  },
  cost(x) {
    return Math.pow(1.5, this.amt(x)) * this.costMul(x);
  },
  can(x) {
    return this.unspent().gte(this.cost(x)) && this.amt(x) < 13;
  },
  buy(x) {
    if (!L1_POLISH.can(x)) return;
    player.boost.bu[x] = Decimal.add(player.boost.bu[x] || 0, 1).round();
  },
  respec() {
    if (
      !confirm(
        "This will reset Enhancements and perform a Booster reset. Are you sure?"
      )
    )
      return;
    player.boost.bu = {};
    doLayer1Reset(true);
  },

  flat(x) {
    return this.amt(x) + 1;
  },
  amt(x) {
    // for now, as it doesn't work?
    return (player.boost.bu && D(player.boost.bu[x]).round().toNumber()) || 0;
  },
  total() {
    let t = 0;
    // can someone mke this more clearer
    for (let i = 0; i < 5; i++)
      t += (Math.pow(1.5, this.amt(i)) - 1) * 2 * this.costMul(i);
    return t;
  },
  totalamt() {
    let t = 0;
    for (let i = 0; i < 5; i++) t += this.amt(i);
    return t;
  },
  maxamt() {
    let t = 0;
    for (let i = 0; i < 5; i++) t = Math.max(t, this.amt(i));
    return t;
  },
};
const hasMilestone = L1_MILESTONES.unl;
//CONSUMPTION
const L1_CONSUME = {
  unl: () => L1_MILESTONES.unl(7),
  setupDOM() {
    document.getElementById("darkToning").innerHTML = htmlFor(
      this.toneData,
      (value, key) => `
			<tr id="darkToneDiv${key}">
				<td>
					<button onclick="L1_CONSUME.tone(-1, ${key})">-1</button>
					<button onclick="L1_CONSUME.tone(0, ${key})">(0)</button>
					<button onclick="L1_CONSUME.tone(1, ${key})">+1</button>
				</td>
				<td id="darkToneEff${key}"></td>
			</tr>`
    );
  },
  updateDOM() {
    updateBuyThings(`consume_btn`, this.can(), ["cannotbuy", "canbuy"]);
    tmp.cache.consume_amt.writeText(format(this.consumeAmt(), 0));
    tmp.cache.consume_left.writeText(format(this.left(), 0));
    tmp.cache.consume_str.writeText(format(this.req(), 0));
    tmp.cache.dark_eng.writeText(format(player.boost.consume.eng));
    tmp.cache.dark_prod.writeText(format(this.darkProd()));
    tmp.cache.toning_left.writeText(format(this.toneTotal(), 0));
    for (const i of Object.keys(this.toneData)) {
      tmp.cache["darkToneDiv" + i].changeStyle(
        "display",
        this.toneData[i].unl() ? "" : "none"
      );
      tmp.cache["darkToneEff" + i].writeText(
        "(" +
          format(player.boost.consume.upg[i]) +
          " / " +
          format(this.toneData[i].max(this.toneBulk())) +
          ") " +
          this.toneData[i].desc(tmp.darkTones[i])
      );
    }
  },
  updateTmp() {
    tmp.darkTones = {};
    for (const i of Object.keys(this.toneData))
      tmp.darkTones[i] = this.toneData[i].eff(
        D(player.boost.consume.upg[i] || 0)
      );
  },

  consume() {
    if (!L1_CONSUME.can()) return;
    if (
      !confirm(
        "This will consume " +
          format(L1_CONSUME.req(), 0) +
          " boosters and their effect. You won't lose boosters assigned to buildings. A booster reset will also be forced. Are you sure?"
      )
    )
      return;
    player.boost.consume.amt = D(player.boost.consume.amt).add(1);
    doLayer1Reset(true);
  },
  left() {
    return D(player.boost.amt).sub(this.consumeAmt()).sub(14);
  },
  consumeAmt() {
    let amt = D(player.boost.consume.amt);
    return amt.mul(amt.add(hasMilestone(9) ? -1 : 1)).div(2);
  },
  consumeEff() {
    let amt = D(player.boost.consume.amt);
    if (L1_MILESTONES.unl(9)) return amt.mul(amt.add(1)).div(4).add(amt.div(2));
    return amt.mul(amt.add(1)).div(2);
  },

  req() {
    return D(player.boost.consume.amt).add(hasMilestone(9) ? 0 : 1);
  },
  can() {
    return this.left().gte(this.req());
  },

  darkProd() {
    let amt = D(player.boost.consume.amt);
    let points = player.points.max(10).log10();
    if (amt.eq(0)) return D(0);
    return D(2).pow(amt).mul(D(2).pow(points.sqrt())).div(10);
  },
  release() {
    if (
      !confirm(
        "Are you sure you want to release all boosters? A booster reset will be forced."
      )
    )
      return;
    player.boost.consume.amt = D(0);
    player.boost.consume.eng = D(0);
    doLayer1Reset(true);
  },

  toneBulk() {
    return D(player.boost.consume.eng).div(10).max(1).log(4).floor();
  },
  toneTotal() {
    let t = this.toneBulk();
    for (const i of Object.keys(this.toneData))
      t = t.sub(player.boost.consume.upg[i]).round();
    return t;
  },
  canTone(x) {
    return (
      this.toneTotal().gte(1) &&
      D(player.boost.consume.upg[x])
        .add(1)
        .lte(this.toneData[x].max(this.toneBulk()))
    );
  },
  tone(x, i) {
    if (x == 1 && L1_CONSUME.canTone(i)) {
      player.boost.consume.upg[i] = D(player.boost.consume.upg[i])
        .add(1)
        .round();
    }
    if (x == -1 && D(player.boost.consume.upg[i]).gt(0)) {
      player.boost.consume.upg[i] = D(player.boost.consume.upg[i])
        .sub(1)
        .round();
    }
    if (x == 0 && D(player.boost.consume.upg[i]).gt(0)) {
      player.boost.consume.upg[i] = D(0);
    }
  },
  toneData: {
    0: {
      unl: () => true,
      max: (b) => b,
      eff: (l) => D(l),
      desc: (x) => "Add " + format(x) + " effective Boosters.",
    },
    1: {
      unl: () => player.boost.amt.gte(20),
      max: (b) => b.div(2),
      eff(l) {
        return {
          0: D(6).add(l.div(6)).pow(l),
          1: D(5).add(l.div(5)).pow(l),
          2: D(4).add(l.div(4)).pow(l),
          4: D(3).add(l.div(3)).pow(l),
          5: D(2).add(l.div(2)).pow(l),
        };
      },
      desc: (x) => "Buildings produce more points. (variable)",
    },
    2: {
      unl: () => player.boost.amt.gte(25),
      max: (b) => b.div(4),
      eff: (l) => D(1).add(l.div(3)).pow(L1_CONSUME.left().sqrt()),
      desc: (x) =>
        "Gain " + format(x) + "x Points based on remaining Boosters.",
    },
    3: {
      unl: () => player.boost.amt.gte(30),
      max: (b) => b.div(5),
      eff: (l) => 1 + l.toNumber() / 4,
      desc: (x) => "Cheapen Enhancements by /" + format(x) + ".",
    },
    4: {
      unl: () => player.boost.amt.gte(35),
      max: (b) => b.div(5),
      eff: (l) => D(1).add(l.div(2)).pow(0.75),
      desc: (x) => "Raise Upgrade 1 by ^" + format(x) + ".",
    },
  },
};
