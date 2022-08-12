const buyableOrder = [0, 1, 2, 4, 5, 3];
const buyables = {
  0: {
    cost: {
      init() {
        let x = D(10);
        if (L1_MILESTONES.unl(8)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(11)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.4
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(0));
      if (hasAch(8)) r = r.mul(1.09);
      if (hasUpg(4, "normal")) r = r.mul(10);
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(0));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][0]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      return true;
    },
    name: "Maker",
  },
  1: {
    cost: {
      init() {
        let x = D(250);
        if (L1_MILESTONES.unl(8)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(11)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.6
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(1).mul(10);
      if (L1_MILESTONES.unl(1)) r = r.mul(3);
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(1));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][1]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      return Decimal.gte(getBuyable(0), 1) || player.boost.unl;
    },
    name: "Generator",
  },
  2: {
    cost: {
      init() {
        let x = D(1e4);
        if (L1_MILESTONES.unl(8)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(11)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.8
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(2).mul(100);
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(2));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][2]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      return Decimal.gte(getBuyable(1), 10) || player.boost.unl;
    },
    name: "Producer",
  },
  3: {
    cost: {
      init: D(1e5),
      exp: 10,
      scaled: {
        start: 250,
        pow: 1.5
      }
    },
    limit: Infinity,
    prod() {
      let b = getBuyable(3);
      if (L1_CONSUME.unl()) b = b.sub(L1_CONSUME.consumeAmt());
      if (L1_CONSUME.unl()) b = b.add(tmp.darkTones[0]);
      return Decimal.pow(D(2).add(L1_POLISH.eff(3)), b);
    },
    prodDisp(x) {
      return "x" + format(x);
    },
    unlocked() {
      return hasUpgrade(2);
    },
    confirm() {
      if (!player.boost.confirm) return true;
      return confirm(
        "This will reset your progress for a booster, which doubles point gain. Are you sure?"
      );
    },
    onBuy() {
      doLayer1Reset();
      tmp.temp.boosterAuto = true
    },
    name: "Booster"
  },
  4: {
    cost: {
      init() {
        let x = D(1e8);
        if (L1_MILESTONES.unl(8)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(11)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 2
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(4).mul(3e3);
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(4));
      if (hasUpg(5, "normal")) r = r.mul(upgrades.normal.list[5].effect());
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][4]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      return L1_MILESTONES.unl(4);
    },
    name: "Factory",
  },
  5: {
    //Creator Enhancements unlock at Layer 3.
    cost: {
      init: D(1e80),
      exp: 1.5,
      // why do we need it?
      // pow: 2
      // it's due to Creator Enhancements
      // maybe later
      // like superscale or smh
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(5).pow(2)
      if (L2_RECALL.unl()) r = r.mul(tmp.darkRecall.st)
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + " CP/s";
    },
    unlocked() {
      return L1_MILESTONES.unl(12);
    },
    name: "Creator",
  },
};
const BUYABLE_KEYS = Object.keys(buyables);

//Cost functions!
function getBuyableCost(id, lvl) {
  return getCost(buyables[id].cost, lvl || getBuyable(id))
}

function getBuyableBulk(id, res) {
  return getBulk(buyables[id].cost, res || player.points)
}

function isBuyableScaled(id) {
  return isScaled(buyables[id].cost, getBuyable(id))
}

function getBuyableScalePower(id) {
  return isBuyableScaled(id) ? buyables[id].cost.scaled.pow : 1
}

function getBuyableScaleStart(id) {
  return startsAt(buyables[id].cost)
}

//...
function canAffordBuyable(id) {
  return Decimal.gte(player.points, getBuyableCost(id));
}

function buyBuyable(id, max, auto) {
  const dict = buyables;
  const data = dict[id];

  const src = player.buyables;
  const cost = getBuyableCost(id);
  const bulk = getBuyableBulk(id);
  // also this thing is broken
  // buying it actually doesn't buy it

  if (id == 3 && hasUpg(1, "dark")) max = true;
  if (Decimal.gte(player.points, cost)) {
    if (!auto && data.confirm && !data.confirm()) return;
    if (!L1_MILESTONES.unl(11)) player.points = Decimal.sub(
      player.points,
      max ? getBuyableCost(id, bulk.sub(1)) : cost
    ).max(0);
    src[id] = max ? bulk : Decimal.add(src[id], 1);
    if (data.onBuy) data.onBuy();
  }
}
function buyMaxBuyables() {
  for (const i of BUYABLE_KEYS)
    if (i != 3 && buyables[i].unlocked()) buyBuyable(i, true);
}
function getBuyable(id) {
  return D(player.buyables[id] || 0);
}
function updateBuyables() {
  for (const key of BUYABLE_KEYS) {
    tmp.cache[`mainBuyable${key}`].changeStyle(
      "display",
      buyables[key].unlocked() ? "table-row" : "none"
    );
    tmp.cache[`buyableAmount${key}`].writeText(format(getBuyable(key), 0));
    tmp.cache[`buyableProd${key}`].writeText(
      buyables[key].prodDisp(buyables[key].prod())
    );
    updateBuyThings(`buyableButton${key}`, canAffordBuyable(key), [
      "cannotbuy",
      key == 3 ? "prestige" : "canbuy",
    ]);
    tmp.cache[`buyableCost${key}`].writeText(format(getBuyableCost(key)));
    tmp.cache[`buyableBoostDiv${key}`].changeStyle(
      "display",
      player.boost.unl && key != 3 ? "table-cell" : "none"
    );
    tmp.cache[`buyableBoostEff${key}`].changeStyle(
      "display",
      key == 5 ? "table-cell" : 
      player.boost.unl && L1_POLISH.amt(key) ? "table-cell" : "none"
    );
    tmp.cache[`buyableScale${key}`].writeText(
      getScalingName(buyables[key].cost, getBuyable(key))
    )
  }
  // what keeps happening with this
}

const upgrades = {
  normal: {
    dom: "upgrades",
    id: "upgrade",
    src: () => player.upgrades,
    res_src: () => player,
    res: "points",
    spendable: () => L1_MILESTONES.unl(11),
    list: {
      0: {
        //upgrade
        cost: D(1000),
        desc: "Gain more points based on total buildings bought.",
        effect() {
          let r = Object.values(player.buyables).reduce((a, b) =>
            Decimal.add(a, b)
          );
          if (!L1_MILESTONES.unl(2)) r = r.add(1).log10().pow(2).add(1);
          else r = r.add(1).sqrt();
          if (L1_MILESTONES.unl(5)) r = r.pow(1.3);
          if (L1_CONSUME.unl()) r = r.pow(tmp.darkTones[4]);
          return r;
        },
        unlocked: () => true,
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      1: {
        cost: D(1e4),
        desc: "Gain more points based on your points.",
        effect() {
          //why not make third generator first because that will the 3rd upgrade
          if (hasUpg(3)) return D(player.points).add(1).pow(0.1).mul(1.5);
          return Decimal.add(player.points, 1).log10().add(1);
        },
        unlocked: () => true,
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      2: {
        cost: D(5e4),
        desc: "Unlock boosters.", // placeholder
        effectDisplay() {
          return hasUpg(2) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: () => hasUpg(1),
      },
      3: {
        cost: D(1e8),
        desc: "Upgrade 2 has a better formula.",
        effectDisplay() {
          return hasUpg(3) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: () => hasUpg(2),
      },
      4: {
        cost: D(1e9),
        desc: "Makers produce points 10x faster.",
        effectDisplay() {
          return hasUpg(4) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: () => hasUpg(3),
      },
      5: {
        cost: D(1.5e13),
        desc: "Factory production is multiplied by Boosters.",
        effectDisplay() {
          return hasUpg(5) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: () => hasUpg(4),
        effect() {
          return player.boost.amt.add(1)
        },
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      6: {
        cost: D(1e28), // can be changed upon consume balancing
        desc: "Gain more points based on total Enhances.",
        effectDisplay() {
          return hasUpg(6) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: () => hasUpg(5),
        effect() {
          return D(L1_POLISH.totalamt()).div(3).add(1).pow(1.5);
        },
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
    },
  },
  dark: {
    dom: "darkUpgs",
    id: "darkUpg",
    src: () => player.dark.upg,
    res_src: () => player.dark.res,
    res: "dm",
    spendable: () => true,
    list: {
      0: {
        cost: D(1),
        desc: "Gain 5x more Points and 3x more Dark Energy.",
        unlocked: () => true,
        effectDisplay() {
          return hasUpg(0, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      1: {
        cost: D(2),
        desc: "Keep your automation and you can buy max Boosters.",
        unlocked: () => hasUpg(0, "dark"),
        effectDisplay() {
          return hasUpg(1, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      2: {
        cost: D(3),
        desc: "Unlock Abilities and Recall.",
        unlocked: () => hasUpg(0, "dark"),
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
        unlocked: () => hasUpg(2, "dark"),
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      4: {
        cost: D(25),
        desc: "Booster Enhances multiply Dark Toning 1's effect.",
        effect() {
          let amt = D(player.boost.bu[3] || 0)
          return amt.sqrt().div(4).add(1.7)
        },
        unlocked: () => hasUpg(3, "dark"),
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      5: {
        cost: D(50),
        desc: "Gain more Dark Resources based on highest Dark Energy.",
        effect() {
          return D(player.boost.consume.maxEng).div(1e6).add(1).pow(.2)
        },
        unlocked: () => hasUpg(4, "dark"),
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      6: {
        cost: D(100),
        desc: "Automate boosters every 2 seconds, and passively get boosters up to 5 lower than maximum gain.",
        unlocked: () => hasUpg(4, "dark"),
        effectDisplay() {
          return hasUpg(6, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      7: {
        cost: D(200),
        desc: "Unlock Dark Alloying.",
        unlocked: () => hasUpg(6, "dark"),
        effectDisplay() {
          return hasUpg(7, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },

      8: {
        cost: D(1e4),
        desc: "Enhancing is 25% cheaper.",
        unlocked: () => hasUpg(7, "dark"),
        effectDisplay() {
          return hasUpg(8, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      9: {
        cost: D(1e5),
        desc: "Multiply Recall Resources by 2x.",
        unlocked: () => hasUpg(8, "dark"),
        effectDisplay() {
          return hasUpg(9, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      10: {
        cost: D(1e5),
        desc: "Automate Enhance and Consumption.",
        unlocked: () => hasUpg(6, "dark"),
        effectDisplay() {
          return hasUpg(10, "dark") ? "UNLOCKED" : "LOCKED";
        },
      },
      11: {
        cost: D(2e6),
        desc: "Unlock Challenges. [soon]",
        unlocked: () => hasUpg(9, "dark"),
        effectDisplay() {
          return hasUpg(11, "dark") ? "THE END" : "LOCKED";
        },
      },
    },
  },
};
const UPGRADE_KEYS = Object.keys(upgrades);
function canAffordUpgrade(id, type = "normal") {
  const data = upgrades[type];
  return Decimal.gte(data.res_src()[data.res], data.list[id].cost);
}
function buyUpg(id, type = "normal") {
  if (hasUpg(id, type)) return;
  if (!canAffordUpgrade(id, type)) return;

  const data = upgrades[type];
  const res_src = data.res_src();
  data.src()[id] = 1;
  if (data.spendable()) res_src[data.res] = D(res_src[data.res]).sub(data.list[id].cost);
}
function hasUpg(id, type = "normal") {
  const src = upgrades[type].src();
  return !!src[id] && src[id] !== "0";
}
function hasUpgrade(id, type) {
  return hasUpg(id, type);
}

function updateUpgrades(type = "normal") {
  const data = upgrades[type];
  const id = data.id;
  const list = data.list;
  const keys = Object.keys(list);

  for (const key of keys) {
    tmp.cache[`${id}Button${key}`][
      (hasUpg(key, type) ? "add" : "remove") + "Classes"
    ]("bought");
    tmp.cache[`${id}Button${key}`].changeStyle(
      "visibility",
      list[key].unlocked() || hasUpg(key, type) ? "visible" : "hidden"
    );
    if (!hasUpg(key, type)) {
      updateBuyThings(`${id}Button${key}`, canAffordUpgrade(key, type));
    } else {
      tmp.cache[`${id}Button${key}`].removeClasses("canbuy", "cannotbuy");
    }
    tmp.cache[`${id}Effect${key}`].writeText(list[key].effectDisplay());
  }
}

function setupUpgradeBuyables() {
  document.getElementById("buildings").innerHTML = htmlFor(
    buyableOrder,
    function (key) {
      const value = buyables[key];
      const name = value.name
      let html = ""
  
      if (key === 0) html = `<tr><td></td><td></td><td></td><td></td><td>
        <button
          id="automationtoggle"
          onclick="player.automationtoggle=!player.automationtoggle"
        ></button>
        <button id="max_all" onclick="buyMaxBuyables()">Buy max (M)</button>
      </td><td>
        <div id="buyableBoost"></div>
        <button
          id="autoenhance"
          onclick="openModal('boost')"
        >Open Auto</button>
        <button id="polish_respec" onclick="L1_POLISH.respec()">Respec</button>
      </td></tr>`
      //header

      html += `<tr id="mainBuyable${key}">
        <td><img id="${name}img" src="${imageMap(
          // TODO: shrink image
          name.toLowerCase()
        )}"></td>
        <td style='text-align: left; width: 120px'>
          <span id="buyableScale${key}"></span> ${name}</b>:
        </td>
        <td         
         id="buyableAmount${key}"  style='text-align: left; width: 60px'></td>
        <td style="font-size: 14px">
        (<span 
          id="buyableProd${key}"></span>)
        </td>
        <td>
          <button 
            id="buyableButton${key}" 
            class="upgbutton cannotbuy" 
            onclick="buyBuyable(${key})">
 	              Cost: 
            <span
             id="buyableCost${key}"></span> 
            points
          </button>
        </td>
        <td><div id="buyableBoostDiv${key}">
            <button 
              id="buyableBoost${key}" 
              class="upgbutton cannotbuy"
              onclick="L1_POLISH.buy(${key})">
                  (0) Enhance: ??? boosters
            </button>
        </div></td>
        <td id="buyableBoostEff${key}" class="buildboosttext" style="font-size: 10px">
          ${key === 5 ? `<span id="creatorPower"></span> Creator Power<br>(/<span id="creatorPowerEff"></span> building costs)` :
          key === 3 ? `Enhance boost: Increases the base by <span id="buyableFlat${key}"></span>` :
          `Enhance boost: <span id="buyableFlat${key}"></span>x (additive)<br>
          For every <span id="buyableRepeated${key}"></span> buildings, double production.`}
        </td>
      </tr>`;

      if (key === 3) html += `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <button id="autobooster"
            onclick="player.autoBooster=!player.autoBooster">
            Auto: OFF
          </button>
        </td>
      </tr>`
      //footer
  
      return html
    }
  );

  for (const index of UPGRADE_KEYS) {
    let data = upgrades[index];
    let id = data.id;
    document.getElementById(data.dom).innerHTML = htmlFor(
      data.list,
      (value, key) => `
         <button 
           text-align="center"
           id="${id}Button${key}" 
           class="u cannotbuy"
           onclick="buyUpg(${key}, '${index}')">
           ${value.desc}<br><br>
           Cost: 
           <span>
             ${format(value.cost)}
           </span> 
           <br><br>
           Currently: 
           <span
             id="${id}Effect${key}">
           </span>
         </button>
       `+(key % 4 == 3 ? `<br>` : ``)
    );
  }
}

//Extra
function creatorPowerEff() {
  let exp = D(0.7)
  let base = D(player.creatorPower).add(1)

  if (L2_RECALL.unl()) exp = exp.mul(tmp.darkRecall.df)
  return base.pow(exp)
}