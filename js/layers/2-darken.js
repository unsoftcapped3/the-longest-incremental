const DARK_REQ = D(Math.E).pow(100);

function doLayer2Reset(force) {
  if (canLayer2()) force = false;
  if (!force) {
    if (player.dark.times === 0) {
      player.dark.unl = true;
      notify();
    }
    player.dark.times++;
    player.dark.res.dm = D(player.dark.res.dm).add(gainLayer2());
  } else player.dark.restart++;

  
  if (player.dark.time < 60) getAch(31)
  if (D(player.buyables[3]).lte(25)) getAch(32)

  player.dark.time = 0;
  player.dark.abilitytimes = 0;

  player.buyables[3] = D(0);
  player.boost.bu = {};
  player.boost.consume = {
    amt: D(0),
    eng: D(0),
    maxEng: D(0),
    upg: {},

    confirm: player.boost.consume.confirm,
    auto: player.boost.consume.auto,
  };
  player.boost.consume.auto.step = 0

  player.points = D(0);
  player.boost.maxPoints = D(0);
  doLayer1Reset(true);
}

function gainLayer2() {
  if (!canLayer2()) return Decimal.dZero;
  //formula: 10^(((log(point/req)/5)+1)^0.5-1)
  let r = D(10).pow(D(player.boost.maxPoints).div(DARK_REQ).log10().div(5).add(1).sqrt().sub(1))
  if (hasUpg(5, "dark")) r = r.mul(upgrades.dark.list[5].effect());
  if (hasAch(30)) r = r.mul(1.1);
  return r.floor()
}

function nextAtLayer2() {
  let r = gainLayer2().add(1)
  if (hasUpg(5, "dark")) r = r.div(upgrades.dark.list[5].effect());
  return D(10).pow(r.log10().add(1).sqr().sub(1).mul(5)).mul(DARK_REQ)
}

function canLayer2() {
  return D(player.points).gte(DARK_REQ);
}

function doLayer2() {
  if (!canLayer2()) return;
  if (
    player.dark.confirm &&
    !confirm("It's your choice. Are you willing to go with the Dark?")
  )
    return;
  L2_RECALL.recall()
  doLayer2Reset(false);
}

function setupLayer2() {
  return {
    confirm: true,
    time: 0,
    times: 0,
    restart: 0,
    unl: false,

    res: {
      dm: D(0),
      /*
      dc:D(0), //dark charge
      db:D(0), //dark booster
      ir:D(0), //iridium
      sc:D(0), //space crystal
      tc:D(0), //time crystal
      ca:D(0), //coolant
      
      We don't need these due to how L2_RECALL handles with 'undefined / 0' quantities.
      This saves a bit of used data until you gain a resource.
      */
    },
    upg: {},

    recall: 0,
    recallFactors: [0,0,0],
    recallMax: [0,0,0],

    alloyTimes: 0,
    alloyPercentage: 50,
    abilitytimes: 0,
  };
}

function updateLayer2DOM() {
  if (!tmp.cache) return;
  tmp.cache.pre_darken.changeStyle("display", player.dark.unl ? "none" : "");
  tmp.cache.post_darken.changeStyle("display", player.dark.unl ? "" : "none");
  tmp.cache.darken_resetdesc.writeHTML(
    canLayer2()
      ? (L2_RECALL.base().gte(100) ? "Recall the Dark." : "Darken the sun.") +
          (player.dark.unl ? " (+" + formatWhole(gainLayer2()) + ")"+(gainLayer2().lt(1e3)?"<br>Next: "+formatWhole(nextAtLayer2()):"") : "")
      : "Req: " + format(DARK_REQ)
  );
  updateBuyThings(`darken_btn`, canLayer2(), ["cannotbuy", "prestige2"]);
}

function showHideDark() {;
  tmp.cache.dark_bg.changeStyle("display", player.tab == "dark" ? "" : "none");
  tmp.cache.pointsDisplay[
    (player.tab == "dark" ? "add" : "remove") + "Classes"
  ]("darkOverwrite");
}

//ABILITIES
let L2_ABILITY = {
  updateDOM() {
    tmp.cache.abilities.changeStyle("display", hasUpg(2, "dark") ? "" : "none");
    if (!hasUpg(2, "dark")) return

    updateBuyThings('ab_rs', !player.abilities.cd.rs, ["cannotbuy", "canbuy"]);
    updateBuyThings('ab_tw_jump', !player.abilities.cd.tw, ["cannotbuy", "canbuy"]);
    updateBuyThings('ab_tw_speed', !player.abilities.cd.tw, ["cannotbuy", "canbuy"]);

    tmp.cache.ab_rs.writeText(player.abilities.cd.rs ? format(player.abilities.cd.rs)+"s" : "Use!")
    tmp.cache.ab_tw_jump.writeText(player.abilities.cd.tw ? format(player.abilities.cd.tw)+"s" : "Use!")
    tmp.cache.ab_tw_speed.writeText(player.abilities.cd.tw ? format(player.abilities.cd.tw)+"s" : "Use!")

    tmp.cache.ab_rs_max.writeText(format(this.resize.max()))
    tmp.cache.ab_rs_exp.writeText(format(this.resize.exp()))
    tmp.cache.ab_tw_jump_eff.writeText(format(this.time.power().mul(30)))
    tmp.cache.ab_tw_speed_eff.writeText(format(this.time.power()))
  },

  resize: {
    exp() {
      return tmp.darkRecall.sc.mul(player.ach.includes(25) ? 2 : 1.75)
    },
    max() {
      return D(player.boost.maxPoints)
    },
    use() {
      if (player.abilities.cd.rs) return
      let old = player.points
      player.points = player.points.pow(L2_ABILITY.resize.exp()).min(L2_ABILITY.resize.max()).max(player.points)
      if (player.points.log(old).gte(1.5)) getAch(25)
      player.dark.abilitytimes += 1
      player.abilities.cd.rs = tmp.darkRecall.ca
      player.abilities.total++
    }
  },
  time: {
    power() {
      if (!hasUpg(2, "dark")) return D(1)
      let r = tmp.darkRecall.tc.mul(2)
      if (hasAch(26)) r = r.mul(1.1);
      if (hasAch(31)) r = r.mul(1.1);
      if (hasAch(32)) r = r.mul(1.1);
      return r.max(1)
    },
    jump() {
      if (player.abilities.cd.tw) return
      player.abilities.jump = L2_ABILITY.time.power().mul(30)
      player.abilities.cd.tw = tmp.darkRecall.ca
      player.dark.abilitytimes++
      player.abilities.total++
    },
    speed() {
      if (player.abilities.cd.tw) return
      player.abilities.speed = true
      player.abilities.cd.tw = tmp.darkRecall.ca
      player.dark.abilitytimes++
      player.abilities.total++
    }
  }
};

//RECALL
let L2_RECALL = {
  unl: () => hasUpg(2, "dark"),
  setupDOM() {
    document.getElementById("recallResources").innerHTML = htmlFor(
      this.data,
      (value, key) => `
			<tr id="recallRes${key}">
        <td><u><div class="tooltip">${value.name}:<span class="tooltiptext">${value.reqFuse?`Requires fusion`:`Required recalls: ${value.scale.join(", ")}`}</span></div></u></td>
        <td id="recallAmt${key}" style="width: 120px; text-align: left"></td>
        <td id="recallEff${key}" style="text-align: right"></td>
      </tr>`
    );
  },
  updateDOM() {
    for (const [key, factor] of this.factors().entries()) {
      tmp.cache["recallFactor"+key].writeText(format(factor)+"x")
      tmp.cache["recallLvl"+key].writeText(player.dark.recallFactors[key])
    }
    tmp.cache.recallBase.writeText(format(this.base()))

    for (const i of Object.keys(this.data)) {
      let scale = this.data[i].scale
      tmp.cache["recallRes"+i].changeStyle("display",this.data[i].unl() ? "" : "none")
      tmp.cache["recallAmt"+i].writeText(
        format(player.dark.res[i]||0) +
        (this.data[i].reqFuse ? "" : this.canRecall(scale) ? " (+"+format(this.gain(scale, i))+")" : "")
      )
      tmp.cache["recallEff"+i].writeText(this.data[i].desc(tmp.darkRecall[i]))
    }
  },
  updateTmp() {
    tmp.darkRecall = {};
    for (const i of Object.keys(this.data)) {
      tmp.darkRecall[i] = this.data[i].eff(this.res(i));
    }
  },

  base(best) {
    let f = this.factors(best)
    // what this contributes to it being a decimal
    // it's to fix > e1.79e308 values
    return f[0].mul(f[1]).mul(f[2])
  },
  factors(best) {
    //[points, dark energy, dark matter]
    let scale = /*best ? [0,0,0] : */player.dark.recallFactors
    // what is a scale
    return [
      D(player.boost.maxPoints).add(1).log10().sqrt().add(1)
        .root(D(1).add(scale[0] / 6).pow(scale[0])),
      D(player.boost.consume.maxEng).add(1).log10().add(1)
        .root(D(1).add(scale[1] / 10).pow(scale[1])),
      D(player.dark.res.dm).mul(10).add(1).log10().add(1)
        .root(D(1).add(scale[2] / 4).pow(scale[2]))
    ]
  },
  adjust(i, x) {
    player.dark.recallFactors[i] = Math.min(Math.max(player.dark.recallFactors[i] + x, 0), 5)
  },

  gain(scale, id) {
    let prod = (scale[0] + 1) * (scale[1] + 1) * (scale[2] + 1)
    let r = this.base().sqrt().div(D(2).pow(prod))
    r = r.mul(tmp.darkRecall.th)
    if (id == "ca") r = r.mul(tmp.darkRecall.cd)
    if (id == "ha") r = r.mul(tmp.darkRecall.hd)
    if (hasUpg(5, "dark")) r = r.mul(upgrades.dark.list[5].effect());
    if (hasUpg(9, "dark")) r = r.mul(2);
    if (hasAch(30)) r = r.mul(1.1);
    return r
  },
  canRecall(scale) {
    return player.dark.recallFactors[0] >= scale[0] &&
      player.dark.recallFactors[1] >= scale[1] &&
      player.dark.recallFactors[2] >= scale[2]
  },
  recall() {
    player.dark.recall++
    for (const i of Object.keys(this.data)) {
      let scale = this.data[i].scale
      if (this.data[i].reqFuse) continue
      if (this.canRecall(scale)) this.gainRes(i, this.gain(scale, i))
    }
    for (const [key, factor] of this.factors().entries()) player.dark.recallMax[key] = Math.max(player.dark.recallMax[key], player.dark.recallFactors[key])
  },

  res(x) {
    return D(player.dark.res[x] || 0)
  },
  resName(x) {
    return this.data[x].name
  },
  gainRes(id, x) {
    player.dark.res[id] = this.res(id).add(x)
  },
  loseRes(id, x) {
    player.dark.res[id] = this.res(id).sub(x).max(0)
  },

  data: {
    dc: {
      name: "Dark Charge",
      unl: () => true,
      scale: [1,0,1],
      eff: (x) => x.mul(10).add(2).log2().max(1).log2().div(2),
      desc: (x) => "Get "+format(x)+" extra Dark Tonings."
    },
    db: {
      name: "Dark Booster",
      unl: () => true,
      scale: [0,1,0],
      eff: (x) => D(2.5).sub(D(1.5).div(x.mul(10).add(1).log10().div(25).add(1))),
      desc: (x) => "Each Dark Toning boosts Dark Energy by "+format(x)+"x."
    },
    sc: {
      name: "Space Crystal",
      unl: () => true,
      scale: [1,2,0],
      eff: (x) => x.mul(10).add(1).log10().add(1).log10().div(2).add(1),
      desc: (x) => "Resizing efficiency is "+format(x)+"x."
    },
    tc: {
      name: "Time Crystal",
      unl: () => true,
      scale: [0,1,1],
      eff(x) {
        return D(2).sub(D(1).div(x.log10().mul(1.25).add(1))).pow(L1_CONSUME.toneBulk().div(5).add(1))
      },
      desc: (x) => "Boost Timewarp Power by "+format(x)+"x. (based on Dark Tonings)"
    },
    ca: {
      name: "Coolant",
      unl: () => true,
      scale: [0,2,1],
      eff: (x) => 30 / x.mul(10).add(1).log10().div(5).add(1).toNumber(),
      desc: (x) => "Ability cooldown is "+format(x)+"s."
    },
    ha: {
      name: "Heatant",
      unl: () => true,
      scale: [0,2,2],
      eff: (x) => x.add(1).log10().div(2).add(1).pow(Math.sqrt(player.dark.abilitytimes)),
      desc: (x) => "Speed up Boosters by "+format(x)+"x. (based on Abilities in this Darken)"
    },
    ir: {
      name: "Iridium",
      unl: () => hasUpg(5, "dark"),
      scale: [0,1,2],
      eff: (x) => x.mul(100).add(1).log10().add(1),
      desc: (x) => format(x)+"x boost to Dark Energy."
    },
    bs: {
      name: "Bismuth",
      unl: () => hasUpg(7, "dark"),
      scale: [2,0,1],
      eff: (x) => null,
      desc: (x) => "Only for alloy!"
    },
    sf: {
      name: "Solar Flare",
      unl: () => hasUpg(11, "dark"),
      scale: [3,1,0],
      eff: (x) => null,
      desc: (x) => ""
    },
    ds: {
      name: "Dark Steel",
      unl: () => hasUpg(11, "dark"),
      scale: [0,0,5],
      eff: (x) => null,
      desc: (x) => ""
    },
    qs: {
      name: "Quintessence",
      unl: () => layer_placeholder(3),
      scale: [3,3,3],
      eff: (x) => null,
      desc: (x) => ""
    },
    df: {
      name: "Dark Fuel",
      unl: () => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).log10().add(2).log2(),
      desc: (x) => "Raise Creator's effect by ^"+format(x)+"."
    },
    th: {
      name: "Thruster",
      unl: () => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(2).log2(),
      desc: (x) => "Multiply Recall Resources by "+format(x)+"x."
    },
    cd: {
      name: "Cold Dark Matter",
      unl: () => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).sqrt(),
      desc: (x) => "Multiply Coolant by " + format(x) + "x."
    },
    hd: {
      name: "Hot Dark Matter",
      unl: () => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).sqrt(),
      desc: (x) => "Multiply Heatant by " + format(x) + "x."
    },
    st: {
      name: "Spacetime Foam",
      unl: () => hasUpg(7, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).cbrt(),
      desc: (x) => format(x)+"x boost to Creator Power."
    },
    ns: {
      name: "Neutronic Stardust",
      unl: () => hasUpg(11, "dark"),
      reqFuse: true,
      eff: (x) => x.add(1).log10().div(2),
      desc: (x) => "+"+format(x)+" extra Levels to Dark Toning 4."
    },
  }
};

//DARK ALLOY
let L2_ALLOY = {
  unl: () => hasUpg(7, "dark"),
  setupDOM() {
    document.getElementById("alloyResources").innerHTML = htmlFor(
      this.data,
      (value, key) => `
			<tr id="alloyres${key}" style='display: none'>
      <td><button id="alloybtn${key}" class="cannotbuy" style="width: 48px; height: 36px; text-align: center" onclick="L2_ALLOY.fuse(${key})">${value.from[1]?"Fuse!":"Trade!"}</button></td>
        <td id="alloystuff${key}" style="text-align: left">
          <span id="alloyres${key}_0"></span> ${L2_RECALL.resName(value.from[0][0])}`
          + (value.from[1] ? ` + <span id="alloyres${key}_1"></span> ${L2_RECALL.resName(value.from[1][0])}` : '') +
          ` -><br><span id="alloyprod${key}"></span> ${L2_RECALL.resName(value.product)}
        </td>
      </tr>`
    );
  },
  updateDOM() {
    for (const key in Object.keys(this.data)) {
      let value = this.data[key]
      let amt = L2_RECALL.res(value.product)
      let bulk = this.bulk(key)
      let max = bulk.add(1).max(amt)
      tmp.cache["alloyres"+key].changeStyle("display", value.unl() ? "" : "none")
      tmp.cache["alloyres"+key+"_0"].writeText(format(this.total(key, 0, max).sub(this.total(key, 0, amt))))
      if (value.from[1]) tmp.cache["alloyres"+key+"_1"].writeText(format(this.total(key, 1, max).sub(this.total(key, 1, amt))))
      tmp.cache["alloyprod"+key].writeText(format(max.sub(amt), 0))
      updateBuyThings("alloybtn"+key, bulk.gt(amt))
    }
  },
  changePercentage() {
    player.dark.alloyPercentage = document.getElementById("alloyPercentage").value
  },

  fuse(id) {
    let data = L2_ALLOY.data[id]
    let amt = L2_RECALL.res(data.product)
    let bulk = L2_ALLOY.bulk(id)
    if (amt.gte(bulk)) return

    let from = data.from
    L2_RECALL.loseRes(from[0][0], L2_ALLOY.total(id, 0, bulk).sub(L2_ALLOY.total(id, 0, amt)))
    if (from[1]) L2_RECALL.loseRes(from[1][0], L2_ALLOY.total(id, 1, bulk).sub(L2_ALLOY.total(id, 1, amt)))
    L2_RECALL.gainRes(data.product, bulk.sub(amt))

    if (from[1]) player.dark.alloyTimes++
  },
  bulk(id) {
    let data = this.data[id]
    let amt = L2_RECALL.res(data.product)
    let from = data.from
    let percentage = Math.max(Math.min(parseInt(player.dark.alloyPercentage) / 100, 1), 0)

    return Decimal.min(
      this.total(id, 0, amt).add(L2_RECALL.res(from[0][0]).mul(percentage)).div(from[0][1]).root(from[0][2]),
      (from[1] ? this.total(id, 1, amt).add(L2_RECALL.res(from[1][0]).mul(percentage)).div(from[1][1]).root(from[1][2]) : Infinity)
    ).floor()
  },
  total(id, res_id, amt) {
    let data = this.data[id].from[res_id]
    return D(amt).pow(data[2]).mul(data[1])
  },

  data: {
    0: {
      unl: () => true,
      //product
      product: 'dc',
      name: "Dark Charge",
      //[resource, cost, exponent]
      from: {
        0: ["db", D(5), 1],
      }
    },
    1: {
      unl: () => true,
      //product
      product: 'db',
      name: "Dark Booster",
      //[resource, cost, exponent]
      from: {
        0: ["dc", D(0.2), 1],
      }
    },
    2: {
      unl: () => true,
      //product
      product: 'df',
      name: "Dark Fuel",
      //[resource, cost, exponent]
      from: {
        0: ["dc", D(5), 1.5],
        1: ["ir", D(2), 1],
      }
    },
    3: {
      unl: () => true,
      //product
      product: 'th',
      name: "Thruster",
      //[resource, cost, exponent]
      from: {
        0: ["db", D(50), 1],
        1: ["bs", D(1), 1.5],
      }
    },
    4: {
      unl: () => true,
      //product
      product: 'cd',
      name: "Cool Dark Matter",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(5), 1.5],
        1: ["ca", D(5), 1],
      }
    },
    5: {
      unl: () => true,
      //product
      product: 'hd',
      name: "Hot Dark Matter",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(5), 1.5],
        1: ["ha", D(0.5), 1],
      }
    },
    6: {
      unl: () => true,
      //product
      product: 'st',
      name: "Spacetime Foam",
      //[resource, cost, exponent]
      from: {
        0: ["sc", D(200), 1],
        1: ["tc", D(200), 1],
      }
    },
    7: {
      unl: () => hasUpg(11, "dark"),
      //product
      product: 'ns',
      name: "Neutronic Stardust",
      req: "Solar Flare + Thruster",
      //[resource, cost, exponent]
      from: {
        0: ["sf", D(1), 1],
        1: ["th", D(5), 1],
      }
    },
  /*  1: {
      unl: () => false, //condition
      //product
      product: 'ph',
      //[resource, cost, exponent]
      from: {
        0: ["ph", D(100), 1],
        1: ["ph", D(100), 1],
      }
    },
*/
  }
}
