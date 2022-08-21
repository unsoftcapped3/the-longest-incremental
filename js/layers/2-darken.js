const DARK_REQ = Decimal.exp(100);
const DARKEN = (LAYERS[2] = {
  name: "Darken",
  pharse: "Darken the sun.",
  confirm: "It's your choice. Are you willing to go with the Dark?",
  reward: "Booster Enhancements, Dark Upgrades, Rediscovery, Trivial Mode",
  ani: layer2Animation,

  loc: "dark",
  setup() {
    return {
      res: {
        dm: D(0),
      },
      upg: {},
      ab: {
        times: 0,
        total: 0,
        cd: {},
      },
      rc: {
        times: 0,
        f0: [0, 0, 0],
        f1: [0, 0, 0],
        fMax: [0, 0, 0],
      },

      alloyTimes: 0,
      alloyPercentage: 50,
    };
  },

  can() {
    return Decimal.gte(player.points, DARK_REQ);
  },
  gain() {
    if (!this.can()) return Decimal.dZero;

    //formula: 10^(((log(point/req)/5)+1)^0.5-1)
    let r = Decimal.dTen.pow(
      Decimal.div(player.boost.maxPoints, DARK_REQ)
        .log10()
        .div(5)
        .add(Decimal.dOne)
        .sqrt()
        .sub(Decimal.dOne)
    );
    if (hasUpg(5, "dark")) r = r.mul(UPGRADES.dark.list[5].effect());
    if (hasAch(30)) r = r.mul(1.1);
    return r.floor();
  },
  onGain(gain) {
    player.dark.res.dm = Decimal.add(player.dark.res.dm, gain);
  },

  reset() {
    player.dark.ab.times = 0;

    player.buyables[3] = D(0);
    player.boost.unl = false;
    player.boost.bu = {};

    player.boost.consume.amt = D(0);
    player.boost.consume.max = D(0);
    player.boost.consume.eng = D(0);
    player.boost.consume.maxEng = D(0);
    player.boost.consume.upg = {};

    delete player.boost.consume.auto.step;
  },
  onReset() {
    if (L2_RECALL.unl()) {
      L2_RECALL.recall(0);
      if (player.modes.diff === 2) L2_RECALL.recall(1);
      player.dark.rc.times++;
    }
    if (player.dark.time < 60) getAch(31);
    if (D(player.buyables[3]).lte(25)) getAch(32);
    if (tmp.chal.in[0]) getAch(35);
  },
});

function nextAtLayer2() {
  let r = DARKEN.gain().add(1);
  if (hasUpg(5, "dark")) r = r.div(UPGRADES.dark.list[5].effect());
  return D(10).pow(r.log10().add(1).sqr().sub(1).mul(5)).mul(DARK_REQ);
}

function updateLayer2DOM() {
  tmp.cache.pre_darken.changeStyle("display", layerUnl(2) ? "none" : "");
  tmp.cache.post_darken.changeStyle("display", layerUnl(2) ? "" : "none");
  updateBuyThings("darken_btn", DARKEN.can(), ["cannotbuy", "prestige2"]);

  tmp.cache.darken_resetdesc.writeHTML(
    DARKEN.can()
      ? "(D) Darken the sun." +
          (layerUnl(2) /*&& TABS.dark == "upg"*/
            ? " (+" +
              formatWhole(DARKEN.gain()) +
              ")" +
              (DARKEN.gain().lt(1e3)
                ? "<br>Next: " + formatWhole(nextAtLayer2())
                : "")
            : "")
      : "Req: " + format(DARK_REQ)
  );
}

function showHideDark() {
  const dark = player.tab === "dark";

  tmp.cache.dark_bg.changeStyle("display", dark ? "block" : "none");
  tmp.cache.offline_progress.changeStyle("display", dark ? "none" : "");
  tmp.cache.in_chal.changeStyle("display", dark ? "none" : "");

  tmp.cache.pointsDisplay[(dark ? "add" : "remove") + "Classes"](
    "darkOverwrite"
  );
}

function layer2Animation() {
  tmp.cache.pointsDisplay.changeStyle("animation", "fade 4s linear");
  tmp.cache.tabs.changeStyle("animation", "fade 4s linear");
  tmp.cache.tab_dark.changeStyle("animation", "fade 4s linear");
  tmp.cache.dark_block.show();
  tmp.cache.dark_sym.changeStyle("animation", "spinAni 6s ease-in");

  setTimeout(() => {
    tmp.cache.pointsDisplay.changeStyle("opacity", 0);
    tmp.cache.tabs.changeStyle("opacity", 0);
    tmp.cache.tab_dark.changeStyle("opacity", 0);
    tmp.cache.dark_block.changeStyle("background", "purple");
  }, 2000);

  setTimeout(() => {
    tmp.cache.dark_block.changeStyle("background", "white");
  }, 4000);

  setTimeout(() => {
    tmp.cache.pointsDisplay.changeStyle("opacity", 1);
    tmp.cache.pointsDisplay.changeStyle("animation", "");
    tmp.cache.tabs.changeStyle("opacity", 1);
    tmp.cache.tabs.changeStyle("animation", "");
    tmp.cache.tab_dark.changeStyle("opacity", 1);
    tmp.cache.tab_dark.changeStyle("animation", "");
    tmp.cache.dark_block.hide();
    tmp.cache.dark_sym.changeStyle("animation", "");
    tmp.cache.dark_block.changeStyle("background", "transparent");
    layerNotify(2);
  }, 6000);
}

UPGRADES.dark = {
  dom: "darkUpgs",
  id: "darkUpg",
  src() {
    return player.dark?.upg ?? {};
  },
  res: "dm",
  spendable: true,
  list: {
    0: {
      cost: Decimal.dOne,
      desc: "Gain 5x more Points and 3x more Dark Energy.",
      unlocked() {
        return true;
      },
      effectDisplay() {
        return hasUpg(0, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    1: {
      cost: Decimal.dTwo,
      desc: "Keep your automation, and you can buy max Boosters.",
      unlocked() {
        return hasUpg(0, "dark");
      },
      effectDisplay() {
        return hasUpg(1, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    2: {
      cost: D(3),
      desc: "Unlock Abilities and Recall.",
      unlocked() {
        return hasUpg(0, "dark");
      },
      effectDisplay() {
        return hasUpg(2, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },

    3: {
      cost: D(5),
      desc: "Gain more Points based on Dark Matter.",
      effect() {
        return D(player.dark.res.dm).add(1).log10().sqr().add(3);
      },
      unlocked() {
        return hasUpg(2, "dark");
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      },
    },
    4: {
      cost: D(25),
      desc: "Multiply Dark Toning 1's effect by 1.9x.",
      unlocked() {
        return hasUpg(3, "dark");
      },
      effectDisplay() {
        return hasUpg(2, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    5: {
      cost: D(100),
      desc: "Gain more Dark Resources based on highest Dark Energy.",
      effect() {
        return D(player.boost.consume.maxEng).div(1e6).add(1).pow(0.2);
      },
      unlocked() {
        return hasUpg(4, "dark");
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      },
    },
    6: {
      cost: D(100),
      desc: "Automate boosters every 2 seconds, and passively get boosters up to 5 lower than maximum gain.",
      unlocked() {
        return hasUpg(4, "dark");
      },
      effectDisplay() {
        return hasUpg(6, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    7: {
      cost: D(400),
      desc: "Unlock Dark Alloying.",
      unlocked() {
        return hasUpg(6, "dark");
      },
      effectDisplay() {
        return hasUpg(7, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },

    8: {
      cost: D(1e4),
      desc: "Enhancing is 25% cheaper.",
      unlocked() {
        return hasUpg(7, "dark");
      },
      effectDisplay() {
        return hasUpg(8, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    9: {
      cost: D(1e5),
      desc: "Multiply Recall Resources by 2x.",
      unlocked() {
        return hasUpg(8, "dark");
      },
      effectDisplay() {
        return hasUpg(9, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    10: {
      cost: D(1e5),
      desc: "Automate Enhance and Consumption. Additionally, you can max use Tonings.",
      unlocked() {
        return hasUpg(6, "dark");
      },
      effectDisplay() {
        return hasUpg(10, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
    11: {
      cost: D(5e6),
      desc: "Unlock Challenges.",
      unlocked() {
        return hasUpg(9, "dark");
      },
      effectDisplay() {
        return hasUpg(11, "dark") ? "UNLOCKED" : "LOCKED";
      },
    },
  },
};

//ABILITIES
const L2_ABILITY = {
  updateDOM() {
    tmp.cache.abilities.changeStyle("display", hasUpg(2, "dark") ? "" : "none");
    if (!hasUpg(2, "dark")) return;

    updateBuyThings("ab_rs", !player.dark.ab.cd.rs, ["cannotbuy", "canbuy"]);
    updateBuyThings("ab_tw_jump", !player.dark.ab.cd.tw, [
      "cannotbuy",
      "canbuy",
    ]);
    updateBuyThings("ab_tw_speed", !player.dark.ab.cd.tw, [
      "cannotbuy",
      "canbuy",
    ]);

    tmp.cache.ab_rs.writeText(
      player.dark.ab.cd.rs ? formatTime(player.dark.ab.cd.rs) : "(1) Use!"
    );
    tmp.cache.ab_tw_jump.writeText(
      player.dark.ab.cd.tw ? formatTime(player.dark.ab.cd.tw) : "(2) Use!"
    );
    tmp.cache.ab_tw_speed.writeText(
      player.dark.ab.cd.tw ? formatTime(player.dark.ab.cd.tw) : "(3) Use!"
    );

    tmp.cache.ab_rs_max.writeText(format(this.resize.max()));
    tmp.cache.ab_rs_exp.writeText(format(this.resize.exp()));
    tmp.cache.ab_tw_jump_eff.writeText(formatTime(this.time.power().mul(30)));
    tmp.cache.ab_tw_speed_eff.writeText(format(this.time.power()));
  },

  resize: {
    exp() {
      return tmp.darkRecall.sc.mul(player.ach.includes(25) ? 2 : 1.75);
    },
    max() {
      return D(
        player[hasChaReward(3, 2) && !player.dark.chal.in ? "dark" : "boost"]
          .maxPoints
      );
    },
    use() {
      if (player.dark.ab.cd.rs) return;
      let old = player.points;
      player.points = player.points
        .pow(L2_ABILITY.resize.exp())
        .min(L2_ABILITY.resize.max())
        .max(player.points);
      if (player.points.log(old).gte(1.5)) getAch(25);
      player.dark.ab.times += 1;
      player.dark.ab.cd.rs = tmp.darkRecall.ca;
      player.dark.ab.total++;
    },
  },
  time: {
    basePower() {
      if (!hasUpg(2, "dark")) return Decimal.dOne;
      let r = tmp.darkRecall.tc.mul(2);
      if (hasAch(26)) r = r.mul(1.1);
      if (hasAch(31)) r = r.mul(1.1);
      if (hasAch(32)) r = r.mul(1.1);
      return r.max(1);
    },
    power() {
      let max;
      if (player.modes.diff === 0) max = Decimal.dOne;
      if (player.modes.diff === 1 || player.modes.diff === 2) max = Decimal.dTwo;
      return this.basePower().min(max ?? Decimal.dInf);
    },
    jump() {
      if (player.dark.ab.cd.tw) return;
      player.dark.ab.jump = L2_ABILITY.time.power().mul(30);
      player.dark.ab.cd.tw = tmp.darkRecall.ca;
      player.dark.ab.times++;
      player.dark.ab.total++;
    },
    speed() {
      if (player.dark.ab.cd.tw) return;
      player.dark.ab.speed = true;
      player.dark.ab.cd.tw = tmp.darkRecall.ca;
      player.dark.ab.times++;
      player.dark.ab.total++;
    },
  },
};

//RECALL
const L2_RECALL = {
  unl() { 
return hasUpg(2, "dark")
  },
  setupDOM() {
    tmp.cache.recallResources.writeHTML(
      htmlFor(this.data, (value, key) => {
        let fuse = value.reqFuse;
        let curr = !value.eff;
        let eff = value.eff;
        return `<tr id="recallRes${key}">
          <td class="darkRecall ${fuse ? "fuse" : curr ? "curr" : ""}">
            <div class="tooltip"><u style="color: white">${value.name}</u>
            <span class="tooltiptext">${
              fuse
                ? `Requires fusion`
                : `Required recalls: ${value.scale.join(", ")}` +
                  (curr ? ` (Alloy resource)` : ``)
            }</span></div>
          </td>
          <td id="recallAmt${key}" style="width: 120px; text-align: left"></td>
          <td id="recallEff${key}" style="width: 240px; text-align: right"></td>
        </tr>`;
      })
    );
  },
  updateDOM() {
    let rc = player.dark.rc;
    let c = this.channel;
    let f = rc["f" + c];

    for (const [key, factor] of this.factors(this.channel).entries()) {
      tmp.cache["recallFactor" + key].writeText(format(factor) + "x");
      tmp.cache["recallLvl" + key].writeText(f[key]);
    }
    tmp.cache.recallBase.writeText(format(this.base(c)));
    tmp.cache.recallChannel.changeStyle(
      "display",
      player.modes.diff == 2 ? "" : "none"
    );

    for (const i of Object.keys(this.data)) {
      const d = this.data[i];
      const scale = d.scale;
      tmp.cache["recallRes" + i].changeStyle(
        "display",
        this.data[i].unl() ? "" : "none"
      );
      tmp.cache["recallAmt" + i].writeHTML(
        format(this.res(i), d.reqFuse ? 0 : 2) +
          (!d.reqFuse && this.canRecall(f, scale)
            ? "<br>(+" + format(this.gain(i, c)) + ")"
            : "")
      );
      tmp.cache["recallEff" + i].writeText(
        this.data[i].desc(tmp.darkRecall[i])
      );
    }
  },
  updateTmp() {
    tmp.darkRecall = {};

    if (!this.unl()) return;
    for (const i of Object.keys(this.data)) {
      if (this.data[i].eff) tmp.darkRecall[i] = this.data[i].eff(this.res(i));
    }
    tmp.darkRecall.mulFull = this.gainMulFull(); //used for fusing
    tmp.darkRecall.mul = this.gainMul().mul(tmp.darkRecall.mulFull);
  },

  channel: 0,
  base(channel, gain) {
    const f = this.factors(channel, gain);
    let r = f[0].mul(f[1]).mul(f[2]);
    if (hasChaReward(4, 0)) r = r.mul(1.25);
    return r;
  },
  factors(channel, gain) {
    //[points, dark energy, dark matter]
    let f = player.dark.rc["f" + channel];
    if (gain && player.modes.diff == 0) f = [0, 0, 0];
    if (gain && player.modes.diff == 1) f = [f[0] / 2, f[1] / 2, f[2] / 2];
    return [
      D(player.boost.maxPoints)
        .add(1)
        .log10()
        .sqrt()
        .add(1)
        .root(
          D(1)
            .add(f[0] / 6)
            .pow(f[0])
        ),
      D(player.boost.consume.maxEng)
        .add(1)
        .log10()
        .add(1)
        .root(
          D(1)
            .add(f[1] / 10)
            .pow(f[1])
        ),
      D(player.dark.res.dm)
        .mul(10)
        .add(1)
        .log10()
        .add(1)
        .root(
          D(1)
            .add(f[2] / 4)
            .pow(f[2])
        ),
    ];
  },
  adjust(i, x) {
    const f = player.dark.rc["f" + L2_RECALL.channel];
    f[i] = Math.min(Math.max(f[i] + x, 0), 5);
  },

  gain(id, channel) {
    let r = this.base(channel, true).sqrt();
    r = r.mul(tmp.darkRecall.mul);
    if (id == "ca") r = r.mul(tmp.darkRecall.cd);
    if (id == "ha") r = r.mul(tmp.darkRecall.hd);
    if ((id == "ca" || id == "ha") && hasChaReward(5, 0))
      r = r.mul(chalEff(5, 0));

    let f = this.data[id].scale;
    let penalty = (f[0] + 1) * (f[1] + 1) * (f[2] + 1);
    r = r.div(D(2).pow(penalty));

    return r;
  },
  gainMul() {
    let r = tmp.darkRecall.th;
    if (hasUpg(5, "dark")) r = r.mul(UPGRADES.dark.list[5].effect());
    if (hasUpg(9, "dark")) r = r.mul(2);
    if (hasAch(30)) r = r.mul(1.1);
    return r.mul(tmp.darkRecall.mulFull);
  },
  gainMulFull() {
    let r = D(1);
    if (hasChaReward(1, 0)) r = r.mul(chalEff(1, 0));
    if (hasChaReward(4, 1)) r = r.mul(2);
    return r;
  },
  canRecall(f, s) {
    if (player.modes.diff == 0) return true;
    let max = 0;
    if (Math.max(Math.max(f[0], f[1]), f[2]) == 5) {
      if (hasChaReward(1, 2)) max = 1;
      if (hasChaReward(1, 3)) max = 2;
    }
    return (
      Math.max(f[0], max) >= s[0] &&
      Math.max(f[1], max) >= s[1] &&
      Math.max(f[2], max) >= s[2]
    );
  },
  recall(c) {
    let rc = player.dark.rc;
    let f = rc["f" + c];
    rc.times++;
    for (const i of Object.keys(this.data)) {
      const d = this.data[i];
      if (d.reqFuse) continue;
      if (this.canRecall(f, d.scale)) this.gainRes(i, this.gain(i, c));
    }
    for (const [key, factor] of f.entries())
      rc.fMax[key] = Math.max(rc.fMax[key], f[key]);
  },

  res(x) {
    return D(player.dark?.res?.[x] ?? 0);
  },
  resName(x) {
    return this.data[x].name;
  },
  gainRes(id, x) {
    player.dark.res[id] = this.res(id).add(x);
  },
  loseRes(id, x) {
    player.dark.res[id] = this.res(id).sub(x).max(0);
  },

  data: {
    dc: {
      name: "Dark Charge",
      unl: (_) => true,
      scale: [1, 0, 1],
      eff: (x) => x.mul(3).add(1).log10().sqrt(),
      desc: (x) => "Get " + format(x) + " extra Dark Tonings.",
    },
    db: {
      name: "Dark Booster",
      unl: (_) => true,
      scale: [0, 1, 0],
      eff: (x) =>
        D(1.5).sub(D(0.5).div(x.mul(10).add(1).log10().div(6).add(1))),
      desc: (x) => "Each Dark Toning boosts Dark Energy by " + format(x) + "x.",
    },
    sc: {
      name: "Space Crystal",
      unl: (_) => true,
      scale: [1, 2, 0],
      eff: (x) => x.mul(10).add(1).log10().add(1).log10().div(2).add(1),
      desc: (x) => "Resizing efficiency is " + format(x) + "x.",
    },
    tc: {
      name: "Time Crystal",
      unl: (_) => true,
      scale: [0, 1, 1],
      eff(x) {
        return D(2)
          .sub(D(1).div(x.add(1).log10().mul(1.25).add(1)))
          .pow(L1_CONSUME.toneBulk().div(5).add(1));
      },
      desc: (x) =>
        "Boost Timewarp Power by " + format(x) + "x. (based on Dark Tonings)",
    },
    ca: {
      name: "Coolant",
      unl: (_) => true,
      scale: [0, 2, 1],
      eff: (x) => 30 / x.mul(10).add(1).log10().div(5).add(1).toNumber(),
      desc: (x) => "Ability cooldown is " + format(x) + "s.",
    },
    ha: {
      name: "Heatant",
      unl: (_) => true,
      scale: [0, 2, 2],
      eff: (x) => x.mul(10).add(1).log10().add(1).pow(2.5),
      desc: (x) => "Speed up pre-Darken by " + format(x) + "x.",
    },
    ir: {
      name: "Iridium",
      unl: (_) => hasUpg(5, "dark"),
      scale: [0, 1, 2],
      eff: (x) => x.mul(10).add(1).log10().add(1).pow(1.5),
      desc: (x) => format(x) + "x boost to Dark Energy.",
    },
    sf: {
      name: "Solar Flare",
      unl: (_) => hasChaReward(1, 1),
      scale: [5, 0, 0],
      desc: (x) => "",
    },
    el: {
      name: "Electronium",
      unl: (_) => hasChaReward(1, 1),
      scale: [0, 4, 0],
      desc: (x) => "",
    },
    ds: {
      name: "Dark Steel",
      unl: (_) => hasChaReward(1, 1),
      scale: [0, 0, 5],
      desc: (x) => "",
    },
    es: {
      name: "Essence",
      unl: (_) => hasChaReward(6, 1),
      scale: [2, 3, 2],
      desc: (x) => "",
    },
    /*qs: {
      name: "Quintessence",
      unl: _ => false,
      scale: [5,5,5],
      desc: (x) => ""
    },*/
    df: {
      name: "Dark Fuel",
      unl: (_) => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).log10().add(3).log(3),
      desc: (x) => "Raise Creator's effect by ^" + format(x) + ".",
    },
    th: {
      name: "Thruster",
      unl: (_) => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(2).log2(),
      desc: (x) => "Multiply Recall Resources by " + format(x) + "x.",
    },
    cd: {
      name: "Cold Dark Matter",
      unl: (_) => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).sqrt(),
      desc: (x) => "Multiply Coolant by " + format(x) + "x.",
    },
    hd: {
      name: "Hot Dark Matter",
      unl: (_) => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).sqrt(),
      desc: (x) => "Multiply Heatant by " + format(x) + "x.",
    },
    st: {
      name: "Spacetime Foam",
      unl: (_) => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).cbrt(),
      desc: (x) => format(x) + "x boost to Creator Power gain.",
    },
    ss: {
      name: "Strange Stardust",
      unl: (_) => hasChaReward(1, 1),
      reqFuse: true,
      eff: (x) => x.add(1).log10().add(1).log10().div(2).add(1),
      desc: (x) => "Cheapen Enhancements by /" + format(x) + ".",
    },
    dd: {
      name: "Dark Stardust",
      unl: (_) => hasChaReward(1, 1),
      reqFuse: true,
      eff: (x) => x.add(1).log10().div(2).add(1).log10().add(1),
      desc: (x) => "Each Enhance boosts Dark Energy by " + format(x) + "x.",
    },
  },
};

//DARK ALLOY
let L2_ALLOY = {
  unl: (_) => hasUpg(7, "dark"),
  setupDOM() {
    tmp.cache.alloyResources.writeHTML(
      htmlFor(
        this.data,
        (value, key) =>
          `
      <tr id="alloyres${key}" style='display: none'>
      <td><button id="alloybtn${key}" class="cannotbuy" style="width: 60px; height: 36px; text-align: center" onclick="L2_ALLOY.fuse(${key})">${
            value.from[1] ? "Fuse!" : "Trade!"
          }</button></td>
        <td id="alloystuff${key}" style="text-align: left">
          <span id="alloyres${key}_0"></span> ${L2_RECALL.resName(
            value.from[0][0]
          )}` +
          (value.from[1]
            ? ` + <span id="alloyres${key}_1"></span> ${L2_RECALL.resName(
                value.from[1][0]
              )}`
            : "") +
          ` -><br><span id="alloyprod${key}"></span> ${L2_RECALL.resName(
            value.product
          )}
        </td>
      </tr>`
      )
    );
  },
  updateDOM() {
    for (const key in Object.keys(this.data)) {
      let value = this.data[key];
      let amt = L2_RECALL.res(value.product);
      let bulk = this.bulk(key);
      let max = bulk.add(1).max(amt);
      tmp.cache["alloyres" + key].changeStyle(
        "display",
        value.unl() ? "" : "none"
      );
      tmp.cache["alloyres" + key + "_0"].writeText(
        format(this.total(key, 0, max).sub(this.total(key, 0, amt)))
      );
      if (value.from[1])
        tmp.cache["alloyres" + key + "_1"].writeText(
          format(this.total(key, 1, max).sub(this.total(key, 1, amt)))
        );
      tmp.cache["alloyprod" + key].writeText(format(max.sub(amt), 0));
      updateBuyThings("alloybtn" + key, bulk.gt(amt));
    }
  },
  changePercentage() {
    player.dark.alloyPercentage = tmp.cache.alloyPercentage.getAttr("value");
  },

  fuse(id) {
    let data = L2_ALLOY.data[id];
    let amt = L2_RECALL.res(data.product);
    let bulk = L2_ALLOY.bulk(id);
    if (amt.gte(bulk)) return;

    let from = data.from;
    L2_RECALL.loseRes(
      from[0][0],
      L2_ALLOY.total(id, 0, bulk).sub(L2_ALLOY.total(id, 0, amt))
    );
    if (from[1])
      L2_RECALL.loseRes(
        from[1][0],
        L2_ALLOY.total(id, 1, bulk).sub(L2_ALLOY.total(id, 1, amt))
      );
    L2_RECALL.gainRes(data.product, bulk.sub(amt));

    if (from[1]) player.dark.alloyTimes++;
  },
  bulk(id) {
    let data = this.data[id];
    let amt = L2_RECALL.res(data.product);
    let from = data.from;
    let percentage = Math.max(
      Math.min(parseInt(player.dark.alloyPercentage) / 100, 1),
      0
    );
    let mul = tmp.darkRecall.mulFull;

    return Decimal.min(
      this.total(id, 0, amt)
        .add(L2_RECALL.res(from[0][0]).mul(percentage))
        .div(from[0][1])
        .root(from[0][2])
        .mul(mul),
      from[1]
        ? this.total(id, 1, amt)
            .add(L2_RECALL.res(from[1][0]).mul(percentage))
            .div(from[1][1])
            .root(from[1][2])
            .mul(mul)
        : Infinity
    ).floor();
  },
  total(id, res_id, amt) {
    let data = this.data[id].from[res_id];
    return D(amt).div(tmp.darkRecall.mulFull).pow(data[2]).mul(data[1]);
  },

  data: {
    //Trades
    0: {
      unl: (_) => true,
      //product
      product: "dc",
      //[resource, cost, exponent]
      from: {
        0: ["db", D(5), 1],
      },
    },
    1: {
      unl: (_) => hasChaReward(1, 1),
      //product
      product: "dc",
      //[resource, cost, exponent]
      from: {
        0: ["el", D(0.05), 1],
      },
    },
    2: {
      unl: (_) => true,
      //product
      product: "db",
      //[resource, cost, exponent]
      from: {
        0: ["dc", D(0.2), 1],
      },
    },
    3: {
      unl: (_) => hasChaReward(1, 1),
      //product
      product: "ir",
      //[resource, cost, exponent]
      from: {
        0: ["ds", D(3), 1],
      },
    },

    //Fusions
    4: {
      unl: (_) => true,
      //product
      product: "df",
      //[resource, cost, exponent]
      from: {
        0: ["dc", D(5), 1.5],
        1: ["ir", D(2), 1],
      },
    },
    5: {
      unl: (_) => true,
      //product
      product: "th",
      //[resource, cost, exponent]
      from: {
        0: ["db", D(50), 1],
        1: ["ir", D(1), 1.5],
      },
    },
    6: {
      unl: (_) => true,
      //product
      product: "cd",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(5), 1.5],
        1: ["ca", D(5), 1],
      },
    },
    7: {
      unl: (_) => true,
      //product
      product: "hd",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(5), 1.5],
        1: ["ha", D(0.5), 1],
      },
    },
    8: {
      unl: (_) => true,
      //product
      product: "st",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(200), 1],
        1: ["tc", D(200), 1],
      },
    },
    9: {
      unl: (_) => hasChaReward(1, 1),
      //product
      product: "ss",
      //[resource, cost, exponent]
      from: {
        0: ["sf", D(1e6), 1],
        1: ["el", D(2e6), 3],
      },
    },
    10: {
      unl: (_) => hasChaReward(1, 1),
      //product
      product: "dd",
      //[resource, cost, exponent]
      from: {
        0: ["sf", D(2e6), 1],
        1: ["ds", D(4e6), 3],
      },
    },
    /*  1: {
      unl: _ => false, //condition
      //product
      product: 'ph',
      //[resource, cost, exponent]
      from: {
        0: ["ph", D(100), 1],
        1: ["ph", D(100), 1],
      }
    },
*/
  },
};
