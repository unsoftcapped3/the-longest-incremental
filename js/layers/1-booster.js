function doLayer1Reset(force) {
  if (canAffordBuyable(3)) force = false;
  if (!force) {
    if (player.boost.times === 0) {
      player.boost.unl = true;
      notify();
    }
    if (Object.values(player.buyables)
        .every((i,k)=>k===3||Decimal.lt(i,10))) getAch(12);
    if (player.boost.time < 60) getAch(19);
    player.boost.times++;
    player.boost.amt = player.buyables[3];
  } else player.boost.restart++
  player.boost.time = 0;
  player.boost.realTime = 0;

  player.points = D(10);
  player.creatorPower = D(0);
  Object.keys(player.buyables).forEach(
    (x) => x !== "3" && (player.buyables[x] = D(0))
  );
  Object.keys(player.upgrades).forEach(
    (x) => x !== "2" && (player.upgrades[x] = 0) // DO NOT PUT SEMICOLON HERE
  );

  if (!force && player.boost.consume.auto.on && player.boost.consume.auto.step == 0 && L1_CONSUME.bulk().sub(player.boost.consume.max || 0).gte(1)) L1_CONSUME_AUTO[0]()
}

function setupLayer1() {
  return {
    confirm: true,
    time: 0,
    realTime: 0,
    times: 0,
    restart: 0,
    maxPoints: D(0),
    amt: D(0),
    unl: false,
    bu: { 0: D(0), 1: D(0), 2: D(0) },
    respecConfirm: true,
    consume: {
      amt: D(0),
      eng: D(0),
      maxEng: D(0),
      upg: {},

      confirm: true,
      auto: {
        on: false,
        step: 0,
      }
    },
  };
}

function getLayer1Speed(idle) {
  let speed = D(1)
  if (!idle && player.abilities.speed) speed = speed.mul(L2_ABILITY.time.power())
  if (L2_RECALL.unl()) speed = speed.mul(tmp.darkRecall.ha)
  return speed
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
				<td id="milestoneDesc${key}">${typeof value.desc === 'function' ? value.desc() : value.desc}</td>
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
      if (typeof this.data[milestone].desc === 'function') {
        tmp.cache[`milestoneDesc${milestone}`].writeText(this.data[milestone].desc())
      }
    }
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
      desc: "Automate Buildings.",
    },
    7: {
      req: D(15),
      desc: "Unlock Consumption and the Dark World.",
    },
    8: {
      req: D(20),
      desc: () => `Factory Enhances raise Buyable base cost by ^${format(1/L1_POLISH.cheap())}.`,
    },
    9: {
      req: D(30),
      desc: "All consumptions consumes 0.25 less Boosters.",
    },
    10: {
      req: D(40),
      desc: "Automate Point Upgrades.",
    },
    11: {
      req: D(50),
      desc: "Buildings and Point Upgrades don't spend anything.",
    },
    12: {
      req: D(75),
      desc: "Unlock Creators. (enhanceless)",
    },
  },
};

//ENHANCEMENTS: By Aarex
//formerly Building Boosters and Polishments
let L1_POLISH = {
  unl(x) {
    if (x == 5) return layer_placeholder(3);
    if (x == 3) return player.dark.unl;
    return player.boost.unl;
  },
  updateEnhanceAuto() {
    for (const key of BUYABLE_KEYS) {
      if (key === "5") continue
      const val = document.getElementById(`selectEnhance${key}`).value
      if (val === '') {
        delete player.enhancePriority[key]
        continue
      }
      player.enhancePriority[key] = Number(val)
    }
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
      if (key === "5") {
        tmp.cache.creatorPower.writeText(format(player.creatorPower))
        tmp.cache.creatorPowerEff.writeText(format(creatorPowerEff()))
      }
      if (key !== "5") tmp.cache[`buyableFlat${key}`].writeText(format(key === "3" ? this.eff(3) : this.flat(key)));
      if (key !== "3" && key !== "5") {
        tmp.cache[`buyableRepeated${key}`].writeText(format(this.perLvl(key)))
      };
    }

    tmp.cache.autoenhance.changeStyle("display", hasUpg(10, "dark") ? "" : "none")
  },
  eff(x) {
    if (x === 3 || x === "3") {
      return this.amt(x) / 26;
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
      [0, 6, 5.5, 5, 4.5, 4, 3.75, 3.5, 3.3, 3.2, 3.1, 3, 2.9, 2.8, 2.7, 2.6, 2.5][Math.min(17, amt)]
      / Math.log2([1.4, 1.6, 1.8, 0, 2, 2.2][x])
    );
  },

  cost(x) {
    return Math.pow(this.costBase(x), this.amt(x)) * this.costMul(x);
  },
  costBase(x) {
    return x == 3 ? 1.75 : 1.5
  },
  costMul(x) {
    let r = 1;
    if (x == 3) r = 10;
    if (L1_MILESTONES.unl(3)) r *= 0.75;
    if (L1_CONSUME.unl()) r /= tmp.darkTones[3];
    if (hasUpg(8, "dark")) r *= 0.75;
    return r;
  },

  unspent() {
    return Decimal.sub(player.boost.amt, this.total());
  },
  can(x) {
    return buyables[x].unlocked() && this.unspent().gte(this.cost(x)) && this.amt(x) < 13;
  },
  buy(x) {
    if (!L1_POLISH.can(x)) return;
    player.boost.bu[x] = Decimal.add(player.boost.bu[x] || 0, 1).round();
  },
  respec() {
    if (
      player.boost.respecConfirm &&
      !confirm("This will reset Enhancements and perform a Booster reset. Are you sure?")
    )
      return;
    player.boost.bu = {};
    doLayer1Reset(true);
  },

  flat(x) {
    return this.amt(x) + 1;
  },
  cheap() {
    return Math.sqrt(this.flat(4))
  },
  amt(x) {
    return (player.boost.bu && D(player.boost.bu[x] || 0).round().toNumber()) || 0;
  },
  total() {
    let t = 0;
    // can someone mke this more clearer
    for (let i = 0; i < 5; i++) {
      let b = this.costBase(i)
      t += (Math.pow(b, this.amt(i)) - 1) / (b - 1) * this.costMul(i);
    }
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
  unl: () => L1_MILESTONES.unl(7) || L1_CONSUME.toneBulk().gt(0),
  updateAuto() {
    for (const key of Object.keys(this.toneData)) {
      const val = document.getElementById(`selectTone${key}`).value
      if (val === '') {
        delete player.toningPriority[key]
        continue
      }
      player.toningPriority[key] = Number(val)
    }
    player.boost.consume.auto.on = document.getElementById(`autoConsumeToggle`).checked
  },
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
				<td id="darkToneLvl${key}"></td>
				<td id="darkToneEff${key}"></td>
			</tr>`
    );
  },
  updateDOM() {
    
    updateBuyThings(`consume_btn`, this.can(), ["cannotbuy", "prestige"]);
    tmp.cache.consume_amt.writeText(format(this.consumeAmt()));
    tmp.cache.consume_left.writeText(format(this.left()));
    tmp.cache.consume_str.writeText(format(this.req()));
    tmp.cache.dark_eng.writeText(format(player.boost.consume.eng));
    tmp.cache.dark_prod.writeText(format(this.darkProd().mul(getLayer1Speed())));
    tmp.cache.dark_tone_req.writeText(format(this.nextToneAt()))

    tmp.cache.toning_total.writeText(format(this.toneBulk(), 0));
    tmp.cache.toning_left.writeText(format(this.toneTotal(), 0));
    for (const i of Object.keys(this.toneData)) {
      tmp.cache["darkToneDiv" + i].changeStyle(
        "display",
        this.toneData[i].unl() ? "" : "none"
      );
      tmp.cache["darkToneLvl" + i].writeText(
        "(" +
        format(player.boost.consume.upg[i],0) +
        " / " +
        format(this.toneData[i].max(this.toneBulk()),0) +
        ") "
      );
      tmp.cache["darkToneEff" + i].writeText(this.toneData[i].desc(tmp.darkTones[i]));
    }

    tmp.cache.autoconsume.changeStyle("display", hasUpg(10, "dark") ? "" : "none")
  },
  updateTmp() {
    tmp.darkTones = {};

    for (const i of Object.keys(this.toneData))
      tmp.darkTones[i] = this.toneData[i].eff(
        D(player.boost.consume.upg[i] || 0)
      );
  },

  consume(max, auto) {
    if (!L1_CONSUME.can()) return;
    if (
      player.boost.consume.confirm && !auto &&
      !confirm("This will consume " + format(L1_CONSUME.req(), 0) + " boosters and their effect. You won't lose boosters assigned to buildings. A booster reset will also be forced. Are you sure?")
    ) return;
    
    tmp.temp.consumeAuto = true
    if (max) {
      let bulk = L1_CONSUME.bulk();
      if (L1_CONSUME.can(bulk)) bulk = bulk.add(1); //fix bulk bug due to quadratic formula
      player.boost.consume.amt = bulk;
    } else {
      player.boost.consume.amt = D(player.boost.consume.amt).add(1);
    }
    player.boost.consume.max = player.boost.consume.amt.max(player.boost.consume.max || 0)
    
    doLayer1Reset(true);
  },
  left(at) {
    return D(player.boost.amt).sub(14).div(4).sub(this.consumeAmt(at)).max(0);
  },
  consumeAmt(at) {
    let amt = D(at || player.boost.consume.amt);
    return amt.sqr().mul(0.125).add(amt.mul(hasMilestone(9) ? -0.125 : 0.125))
  },

  req(at) {
    return D(at || player.boost.consume.amt).add(hasMilestone(9) ? 0 : 1).div(4);
  },
  bulk() {
    let amt = D(player.boost.amt).sub(14).div(4)
    if (amt.lte(0)) return D(0)

    let a = 0.125
    let b = hasMilestone(9) ? -0.125 : 0.125
    let c = amt.negate()

    return D(b*b).sub(c.mul(4*a)).sqrt().sub(b).div(2*a).floor() //quadratic formula
  },
  can(at) {
    return this.left(at).gte(this.req(at));
  },

  darkProd() {
    let amt = D(player.boost.consume.amt);
    let points = D(player.points).max(10).log10();
    if (amt.eq(0)) return D(0);

    let r = D(2).pow(amt.add(points.sqrt())).div(5)
    if (hasUpg(0, "dark")) r = r.mul(3);
    if (L2_RECALL.unl()) r = r.mul(tmp.darkRecall.db.pow(this.toneBulk()))
    if (L2_RECALL.unl()) r = r.mul(tmp.darkRecall.ir)
    return r;
  },
  release(auto) {
    if (D(player.boost.consume.amt).eq(0)) return
    if (
      player.boost.consume.confirm && !auto &&
      !confirm("Are you sure you want to release all boosters? A booster reset will be forced.")
    ) return;
    tmp.temp.consumeAuto = true
    player.boost.consume.amt = D(0);
    player.boost.consume.eng = D(0);
    doLayer1Reset(true);
  },

  toneBulk() {
    let r = D(player.boost.consume.maxEng).div(10).max(1).log(4)
    r = r.add(this.toneExtra())
    return r.floor()
  },
  toneExtra() {
    let r = D(0)
    if (L2_RECALL.unl()) r = r.add(tmp.darkRecall.dc)
    return r
  },
  nextToneAt() {
    return D(4).pow(this.toneBulk().sub(this.toneExtra()).add(1)).mul(10)
  },
  toneTotal() {
    let t = this.toneBulk();
    for (const i of Object.keys(this.toneData))
      t = t.sub(player.boost.consume.upg[i] || 0).round();
    return t;
  },
  canTone(x) {
    return (
      this.toneTotal().gte(1) &&
      D(player.boost.consume.upg[x] || 0)
        .add(1)
        .lte(this.toneData[x].max(this.toneBulk()))
    );
  },
  tone(x, i) {
    if (x == 1 && L1_CONSUME.canTone(i)) {
      player.boost.consume.upg[i] = D(player.boost.consume.upg[i] || 0)
        .add(1)
        .round();
    }
    if (x == -1 && D(player.boost.consume.upg[i] || 0).gt(0)) {
      player.boost.consume.upg[i] = D(player.boost.consume.upg[i] || 0)
        .sub(1)
        .round();
    }
    if (x == 0 && D(player.boost.consume.upg[i] || 0).gt(0)) {
      player.boost.consume.upg[i] = D(0);
    }
  },
  toneMax(b, frac) {
    return b.div(frac).floor()
  },
  toneData: {
    0: {
      unl: () => true,
      max: (b) => L1_CONSUME.toneMax(b, 1),
      eff(l){
        let r = D(l)
        if (hasUpg(4, "dark")) r = r.mul(upgrades.dark.list[4].effect());
        return r
      },
      desc: (x) => "Add " + format(x) + " effective Boosters.",
    },
    1: {
      unl: () => player.boost.amt.gte(20),
      max: (b) => L1_CONSUME.toneMax(b, 2),
      eff(l) {
        return {
          0: D(4).add(l.div(6)).pow(l),
          1: D(3.5).add(l.div(5)).pow(l),
          2: D(3).add(l.div(4)).pow(l),
          4: D(2.5).add(l.div(3)).pow(l),
        };
      },
      desc: (x) => "Buildings produce more points. (variable)",
    },
    2: {
      unl: () => player.boost.amt.gte(25),
      max: (b) => L1_CONSUME.toneMax(b, 4),
      eff(l) {
        return L1_CONSUME.left().add(1).pow(l.div(2))
      },
      desc: (x) =>
        "Gain " + format(x) + "x Points based on remaining Boosters.",
    },
    3: {
      unl: () => player.boost.amt.gte(30),
      max: (b) => L1_CONSUME.toneMax(b, 5),
      eff: (l) => l.add(L2_RECALL.unl()?tmp.darkRecall.ns:0).add(1).log10().add(1),
      desc: (x) => "Cheapen Enhancements by /" + format(x) + ".",
    },
    4: {
      unl: () => player.boost.amt.gte(35),
      max: (b) => L1_CONSUME.toneMax(b, 5),
      eff: (l) => D(1).add(l.div(4)),
      desc: (x) => "Raise Upgrade 1 by ^" + format(x) + ".",
    },
  },
};

// QUESTION: will this be unlocked by DU10?
// It should be because Consumption is automated by DU10.
const L1_CONSUME_AUTO = {
  0() {
    // uses consume :check:
    // auto consume
    L1_CONSUME.consume(true, true)
    setTimeout(() => {
      player.boost.consume.auto.step = 1
    }, 200)
  },
  1() {
    // hmm idk on this
    // auto resize
    if (player.abilities.cd.rs) return
    player.boost.consume.auto.step = 2
  },
  2() {
    // uses consume :check:
    // auto time jump
    if (player.abilities.cd.tw) return
    L2_ABILITY.time.jump()
    player.boost.consume.auto.step = 3
  },
  3() {
    // auto release
    L1_CONSUME.release(true)
    player.boost.consume.auto.step = 0
  },
}