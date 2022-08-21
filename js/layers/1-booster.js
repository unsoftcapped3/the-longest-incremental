const BOOST = {
  name: "Booster",
  confirm: "This will reset your progress for a booster, which doubles point gain. Are you sure?",
  reward: "Enhancements, Stats, Load",
  ani: _ => layerNotify(1),

  loc: "boost",
  setup() {
    return {
      realTime: 0,
      maxPoints: D(0),
      respecConfirm: true,

      bu: {},
      consume: {
        amt: D(0),
        eng: D(0),
        maxEng: D(0),
        upg: {},

        confirm: true,
        max: false,
        auto: {
          on: false,
          step: 0,
        }
      }
    }
  },

  can: _ => canAffordBuyable(3),

  reset() {
    player.boost.realTime = 0

    player.points = D(10)
    player.creatorPower = D(0)
    player.buyables = {3: player.buyables[3]}
    player.upgrades = {2: 1}
  },
  onReset() {
    if (Object.values(player.buyables)
        .every((i,k)=>k===3||Decimal.lt(i,10))) getAch(12)
    if (player.boost.time < 60) getAch(19)
    player.boost.times++
  },
}
const BOOSTER = BOOST
LAYERS[1] = BOOST

function doLayer1Reset(force) {
  doLayerReset(1, force)
  if (!force && player.boost.consume.auto.on && player.boost.consume.auto.step == 0 && L1_CONSUME.bulk().sub(player.boost.consume.max || 0).gte(1)) L1_CONSUME_AUTO[0]()
}

function getLayer1Speed(idle) {
  let speed = D(1)

  if (hasUpg(2, "dark")) {
    let power = L2_ABILITY.time.basePower()
    if (player.modes.diff == 0) speed = speed.mul(power)
    if (player.modes.diff == 1 || player.modes.diff == 2) {
      speed = speed.mul(power.div(2).max(1))
      if (!idle && player.dark.ab.speed) speed = speed.mul(power.min(2))
    }
    if (player.modes.diff == 3 && !idle && player.dark.ab.speed) speed = speed.mul(power)
  }
  if (L2_RECALL.unl()) speed = speed.mul(tmp.darkRecall.ha)

  return speed
}

function getBoosters() {
  return getBuyable(3)
}

//BOOSTER MILESTONES
const L1_MILESTONES = {
  unl: (x) => MILESTONES_CORE.got("boost", x) || (hasChaReward(3, 0) && x < 5),
  setupDOM() {
    MILESTONES_CORE.setup("boostMilestone", "boost")
  },
  updateDOM() {
    MILESTONES_CORE.update("boostMilestone")
  }
};

MILESTONES.boost = {
  res: _ => getBoosters(),
  resName: "Boosters",
  data: [
    {
      req: D(1),
      desc: "Unlock Max All and Enhancements.",
    },
    {
      req: D(2),
      unl: _ => player.modes.diff > 1 || tmp.layer >= 2,
      desc: "Unlock the ability to respec Enhances.",
    },
    {
      req: D(3),
      desc: "Triple Generator Production.",
    },
    {
      req: D(4),
      desc: "Upgrade 1 has a better formula.",
    },
    {
      req: D(5),
      desc: "Enhancements are 25% cheaper.",
    },
    {
      req: D(6),
      desc: "Unlock Building 4: Factory.",
    },
    {
      req: D(8),
      desc: "Raise Upgrade 1's effect to the power of 1.3.",
    },
    {
      req: D(10),
      desc: "Automate Buildings.",
    },
    {
      req: D(13),
      desc: "Unlock Consumption and the Dark World.",
    },
    {
      req: D(20),
      unl: _ => L1_CONSUME.unl() || tmp.layer > 1,
      desc: _ =>
        `Factory Enhances raise Buyable base cost by ^${format(
          1 / L1_POLISH.cheap()
        )}.`,
    },
    {
      req: D(30),
      unl: _ => L1_CONSUME.unl() || tmp.layer > 1,
      desc: "All consumptions consumes 0.25 less Boosters.",
    },
    {
      req: D(35),
      unl: _ => (L1_CONSUME.unl() || tmp.layer > 1) && player.modes.diff < 3,
      desc: _ => "Cheapen Enhancements based on Dark Tonings.",
    },
    {
      req: D(40),
      unl: _ => L1_CONSUME.unl() || tmp.layer > 1,
      desc: "Automate Point Upgrades.",
    },
    {
      req: D(50),
      unl: _ => tmp.layer >= 2,
      desc: "Buildings and Point Upgrades don't spend anything.",
    },
    {
      req: D(75),
      unl: _ => tmp.layer >= 2,
      desc: "Unlock Creators. (cannot be enhanced)",
    },
  ]
}

//ENHANCEMENTS: By Aarex
//formerly Building Boosters and Polishments
let L1_POLISH = {
  unl(x) {
    if (!layerUnl(1)) return false
    if (!buyables[x].unlocked()) return false

    if (x == 0) return true
    if (x == 3) return layerUnl(2)
    if (x == 5) return layer_placeholder(3)
    return player.modes.diff > 1
  },
  updateEnhanceAuto() {
    for (const key of BUYABLE_KEYS) {
      if (key === "5") continue
      const val = tmp.cache[`selectEnhance${key}`].getAttr("value")
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
      MILESTONES_CORE.unl("boost", 1) ? "" : "none"
    );
    tmp.cache.buyableBoostDiv.changeStyle(
      "display",
      layerUnl(1) ? "" : "none"
    )
    tmp.cache.buyableBoost.writeText(`Boosters left: ${format(L1_POLISH.unspent())}`);

    for (const key of BUYABLE_KEYS) {
      if (key === "5") continue

      let unl = this.unl(key)
      let shown = this.amt(this.used(key)) > 0
      tmp.cache[`buyableBoostDiv${key}`].changeStyle(
        "display",
        unl ? "table-row" : "none"
      )
      tmp.cache[`buyableBoostEff${key}`].changeStyle(
        "display",
        shown ? "table-cell" : "none"
      );

      if (unl) {
        tmp.cache[`buyableBoost${key}`].writeText(`(${this.amt(key)}) Enhance: ${format(this.cost(key))} Boosters`);
        updateBuyThings(`buyableBoost${key}`, this.can(key))
      }
      if (shown) {
        tmp.cache[`buyableFlat${key}`].writeText(format(this.eff(key)[0]))
        if (key !== "3") tmp.cache[`buyableRepeated${key}`].writeText(format(this.eff(key)[1]))
      }
    }

    tmp.cache.autoenhance.changeStyle("display", hasUpg(10, "dark") ? "" : "none")
  },


  cost(x) {
    return D(this.costBase(x)).pow(this.amt(x)).mul(this.costMul(x));
  },
  costBase(x) {
    if (inChal(4)) return 2
    return x == 3 ? 1.75 : 1.5
  },
  costMul(x) {
    let r = 1;
    if (x == 3) r = 10;

    if (player.modes.diff <= 2 && L1_MILESTONES.unl(10)) r /= L1_CONSUME.toneBulk().add(1).log10().add(1).toNumber()
    if (player.modes.diff == 2) {
      if (x == 3) r *= 0.8;
      if (x == 4) r /= 2;
    }
    if (player.modes.diff == 3 && L1_CONSUME.unl()) r /= tmp.darkTones[3].toNumber();

    if (L1_MILESTONES.unl(4)) r *= 0.75;
    if (hasUpg(8, "dark")) r *= 0.75;
    if (inChal(4)) r *= 5;
    if (L2_RECALL.unl()) r /= tmp.darkRecall.ss.toNumber();
    if (hasChaReward(2, 2)) r /= chalEff(2, 2);
    return r;
  },

  unspent() {
    let r = getBoosters().sub(this.total());
    if (hasChaReward(2, 1)) r = r.add(chalEff(2, 1))
    return r
  },
  can(x) {
    return this.unl(x) && this.unspent().gte(this.cost(x))
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
    if (hasUpg(10, "dark")) tmp.auto.booster = true;
  },

  eff(x) {
    let u = this.used(x) //determine which enhancements are used
    let amt = this.amt(x)

    if (x == 3) {
      if (amt > 4) return [0.5 - 10 / (26 + amt)]
      return [amt / 26]
    }
    return [amt + 1, this.perLvl(x, u)]
  },
  effProd(x) {
    let eff = this.eff(x)

    let r = D(1);
    r = r.mul(eff[0]); //Effect 1: Multiplication
    r = r.mul(D(2).pow(getBuyable(x).div(eff[1]).floor())); //Effect 2: Per-Level Boost
    return r;
  },
  used(x) {
    if (player.modes.diff <= 1 && (x == 1 || x == 2 || x == 4)) x = 0
    return x
  },
  flat(x) {
    return this.amt(x) + 1
  },
  cheap() {
    return Math.sqrt(this.flat(4))
  },
  amt(x) {
    return D(player?.boost?.bu[x] ?? 0).round().toNumber()
  },
  perLvl(x, u) {
    let amt = this.amt(u)
    let scale = 1 / Math.log2(buyables[x].cost.exp)
    if (amt == 0) return Infinity;
    if (amt < 12) return [0, 6, 5.5, 5, 4.5, 4, 3.75, 3.5, 3.3, 3.2, 3.1, 3][amt] * scale
    //don't try to revert the nerf or it wouldn't be grindy and become unbalanced.
    return (2 + 0.9 / (amt / 20 + 0.4)) * scale
  },

  total() {
    let t = D(0)
    // can someone mke this more clearer
    for (let i = 0; i < 5; i++) {
      let b = this.costBase(i)
      t = D(b).pow(this.amt(i)).sub(1).div(b - 1).mul(this.costMul(i)).add(t)
    }
    return t
  },
  totalamt() {
    let t = D(0)
    for (let i = 0; i < 5; i++) t = t.add(this.amt(i))
    return t.round();
  },
  maxamt() {
    let t = D(0)
    for (let i = 0; i < 5; i++) t = t.max(this.amt(i))
    return t
  },
};

//CONSUMPTION
const L1_CONSUME = {
  unl: _ => L1_MILESTONES.unl(8) || (tmp.layer >= 2 && L1_CONSUME.toneBulk().gt(0)),
  updateAuto() {
    for (const key of Object.keys(this.toneData)) {
      if (key === "1" && inChal(3)) continue
      const val = tmp.cache[`selectTone${key}`]
      if (!val.el || val.getAttr("value") === '') {
        delete player.toningPriority[key]
        continue
      }
      player.toningPriority[key] = Number(val.getAttr("value"))
    }
    player.boost.consume.auto.on = tmp.cache.autoConsumeToggle.getAttr("checked")
  },
  setupDOM() {
    tmp.cache.dark_toning.writeHTML(htmlFor(
      this.toneData,
      (value, key) => `
			<tr id="darkToneDiv${key}">
				<td>
					<button onclick="L1_CONSUME.tone(-1, ${key})">-</button>
					<button onclick="L1_CONSUME.tone(0, ${key})">(0)</button>
					<button onclick="L1_CONSUME.tone(1, ${key})">+</button>
				</td>
				<td id="darkToneLvl${key}"></td>
				<td id="darkToneEff${key}"></td>
			</tr>`
    ));
  },
  updateDOM() {
    const consume = player.modes.diff > 0
    tmp.cache.consume_btn.changeStyle("display", consume ? "" : "none")
    tmp.cache.consume_all.changeStyle("display", consume ? "" : "none")
    tmp.cache.consume_release.changeStyle("display", consume ? "" : "none")
    tmp.cache.consume_auto.changeStyle("display", hasUpg(10, "dark") ? "" : "none")
    if (consume) updateBuyThings(`consume_btn`, this.can(), ["cannotbuy", "prestige1"]);

    tmp.cache.consume_amt.writeText(format(this.consumeAmt()))
    tmp.cache.consume_left.writeText(format(this.left()))
    tmp.cache.consume_str.writeText(format(this.req()))
    tmp.cache.dark_eng.writeText(format(player.boost.consume.eng))
    tmp.cache.dark_prod.writeText(format(this.darkProd().mul(getLayer1Speed())))
    tmp.cache.dark_tone_req.writeText(format(this.nextToneAt()))

    tmp.cache.toning_total.writeText(format(this.toneBulk(), 0))
    tmp.cache.toning_left.writeText(format(this.toneTotal(), 0))
    for (const i of Object.keys(this.toneData)) {
      tmp.cache["darkToneDiv" + i].changeStyle(
        "display",
        this.toneData[i].unl() ? "" : "none"
      );
      tmp.cache["darkToneLvl" + i].writeText(
        "(" +
        format(player.boost.consume.upg[i],0) +
        " / " +
        format(this.toneMax(i),0) +
        ") "
      );
      tmp.cache["darkToneEff" + i].writeText(this.toneData[i].desc(tmp.darkTones[i]));
    }
  },
  updateTmp() {
    tmp.darkTones = {};

    if (!this.unl()) return
    for (const i of Object.keys(this.toneData)) {
      const data = this.toneData[i]
      tmp.darkTones[i] = this.toneData[i].eff(
        D(player.boost.consume.upg[i] || 0)
        .mul(evalVal(data.condense) ?? D(1))
      );
    }
  },

  consume(max, auto) {
    if (!L1_CONSUME.can()) return;
    if (
      player.boost.consume.confirm && !auto &&
      !confirm("This will consume " + format(L1_CONSUME.req(), 0) + " boosters and their effect. You won't lose boosters assigned to buildings. A booster reset will also be forced. Are you sure?")
    ) return;
    
    tmp.auto.consume = true
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
  total() {
    return getBoosters().sub(inChal(1) ? 3 : 12).div(4)
  },
  left(at) {
    return this.total().sub(this.consumeAmt(at)).max(0);
  },
  consumeAmt(at) {
    at = D(at || player.boost.consume.amt);
    return at.sqr().mul(0.125).add(at.mul(L1_MILESTONES.unl(9) ? -0.125 : 0.125))
  },
  consumeEff(at) {
    at = D(at || player.boost.consume.amt);
    if (player.modes.diff == 1) return at.div(4)
    return at.sqr().mul(0.125).add(at.mul(L1_MILESTONES.unl(9) ? -0.125 : 0.125))
  },

  req(at) {
    return D(at || player.boost.consume.amt).add(L1_MILESTONES.unl(9) ? 0 : 1).div(4);
  },
  bulk() {
    let amt = this.total()
    if (amt.lte(0)) return D(0)

    let a = 0.125
    let b = L1_MILESTONES.unl(9) ? -0.125 : 0.125
    let c = amt.negate()

    return D(b*b).sub(c.mul(4*a)).sqrt().sub(b).div(2*a).floor() //quadratic formula
  },
  can(at) {
    return player.modes.diff >= 1 && this.left(at).gte(this.req(at));
  },
  amt() {
    return D(player.boost?.consume?.amt ?? 0)
  },

  darkProd() {
    let amt = player.modes.diff == 0 ? this.bulk() : D(player.boost.consume.amt);
    let points = D(player.modes.diff > 1 ? player.points : player.boost.maxPoints).max(10).log10();
    if (amt.eq(0)) return D(0);

    let r = D(2).pow(amt.add(points.sqrt())).div(5)
    if (hasUpg(0, "dark")) r = r.mul(3);
    if (L2_RECALL.unl()) {
      r = r.mul(tmp.darkRecall.db.pow(this.toneBulk()))
      r = r.mul(tmp.darkRecall.dd.pow(L1_POLISH.totalamt()))
      r = r.mul(tmp.darkRecall.ir)
    }
    // what it's multiplicative
    if (hasChaReward(2, 0)) r = r.mul(chalEff(2, 0))
    if (inChal(5)) r = r.pow(0.55)
    return r;
  },
  eng() {
    return D(player.boost?.consume?.eng ?? 0)
  },
  release(auto) {
    if (D(player.boost.consume.amt).eq(0)) return
    if (
      player.boost.consume.confirm && !auto &&
      !confirm("Are you sure you want to release all boosters? A booster reset will be forced.")
    ) return;
    tmp.auto.consume = true
    player.boost.consume.amt = D(0);
    player.boost.consume.eng = D(0);
    doLayer1Reset(true);
  },

  toneBulk() {
    let r = D(player.boost.consume.maxEng).div(10).max(1).log(4).max(0)
    r = r.mul(this.toneMult())
    r = r.add(this.toneExtra())
    
    return r.floor()
  },
  toneExtra() {
    if (inChal(2)) return D(0)

    let r = D(0)
    if (L2_RECALL.unl()) r = r.add(tmp.darkRecall?.dc ?? 0)
    return r
  },
  toneMult(){
    let mult = D(1)
    if (inChal(2)) mult = mult.div(1.5)
    return mult
  },
  nextToneAt() {
    let amt = this.toneBulk().sub(this.toneExtra())
    return D(4).pow(amt.add(1).times(D(1).div(this.toneMult()))).mul(10)
  },
  toneTotal() {
    let t = this.toneBulk();
    for (const i of Object.keys(this.toneData))
      t = t.sub(player.boost.consume.upg[i] || 0).round();
    return t;
  },
  canTone(x) {
    return this.toneData[x].unl()
  },
  tone(x, i) {
    if (!L1_CONSUME.canTone(i)) return

    let amt = D(player.boost.consume.upg[i] || 0)
    let max = L1_CONSUME.toneTotal().add(amt).round().min(L1_CONSUME.toneMax(i))
    if (hasUpg(10, "dark") && x != 0) x *= 1/0

    if (x == 0) player.boost.consume.upg[i] = D(0)
    else player.boost.consume.upg[i] = amt.add(x)
        .max(0)
        .min(max)
        .round()
  },
  toneMax(i) {
    let r = this.toneData[i].max(L1_CONSUME.toneBulk())
    r = r.div(evalVal(this.toneData[i].condense) ?? D(1))
    return r.max(1)
  },
  toneData: {
    0: {
      unl: _ => !inChal(1),
      max: (b) => b,
      eff(l){
        let r = D(l)
        if (hasUpg(4, "dark")) r = r.mul(1.9);
        return r
      },
      desc: (x) => "Add " + format(x) + " effective Boosters.",
    },
    1: {
      unl: _ => getBoosters().gte(20) && !inChal(3),
      max: (b) => b.div(2).floor(),
      condense() {
        let r = D(1)
        if (hasChaReward(2, 4)) r = chalEff(2, 4)
        return r
      },
      eff(l) {
        return {
          0: D(4).add(l.div(player.modes.diff == 0 ? 3 : 6)).pow(l),
          1: D(player.modes.diff == 0 ? 4 : 3.5).add(l.div(player.modes.diff == 0 ? 3 : 5)).pow(l),
          2: D(player.modes.diff == 0 ? 4 : 3).add(l.div(player.modes.diff == 0 ? 3 : 4)).pow(l),
          4: D(player.modes.diff == 0 ? 4 : 2.5).add(l.div(3)).pow(l),
        };
      },
      desc: (x) => "Buildings produce more points. (variable)",
    },
    2: {
      unl: _ => getBoosters().gte(25) && !inChal(2),
      max: (b) => b.div(4).floor(),
      condense() {
        let r = D(1)
        if (hasChaReward(2, 3)) r = chalEff(2, 3)
        return r
      },
      eff(l) {
        return L1_CONSUME.left().add(1).pow(l.div(2))
      },
      desc: (x) =>
        "Gain " + format(x) + "x Points based on remaining Boosters.",
    },
    3: {
      unl: _ => getBoosters().gte(30) && !inChal(4) && player.modes.diff == 3,
      max: (b) => hasChaReward(3,1) ? D(0) : b.div(5).floor(),
      eff(l) {
        if (hasChaReward(3, 1)) l = L1_CONSUME.toneBulk().div(5).floor()
        return l.add(1).log10().add(1)
      },
      desc: (x) => "Cheapen Enhancements by /" + format(x) + ".",
    },
    4: {
      unl: _ => getBoosters().gte(35),
      max: (b) => b.div(4).floor(),
      condense() {
        let r = D(1)
        if (hasChaReward(2, 5)) r = chalEff(2, 5)
        return r
      },
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
    setTimeout(_ => {
      player.boost.consume.auto.step = 1
    }, 200)
  },
  1() {
    // hmm idk on this
    // auto resize
    // auto time jump
    if (player.dark.ab.cd.rs) return
    if (player.dark.ab.cd.tw) return
    L2_ABILITY.resize.use()
    L2_ABILITY.time.jump()
    player.boost.consume.auto.step = 2
  },
  2() {
    // auto release
    L1_CONSUME.release(true)
    player.boost.consume.auto.step = 0
  },
}