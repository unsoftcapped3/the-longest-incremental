const buyableOrder = [0, 1, 2, 4, 5, 3];
const buyables = {
  0: {
    cost: {
      init() {
        let x = D(10);
        if (L1_MILESTONES.unl(9)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(13)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.4,
      pow: _ => inChal(4) ? 1.5 : 1
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(0));
      if (hasAch(8)) r = r.mul(1.09);
      if (hasUpg(4, "normal")) r = r.mul(10);
      if (layerUnl(1)) r = r.mul(L1_POLISH.effProd(0));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][0]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      return !inChal(1)
    },
    name: "Maker",
  },
  1: {
    cost: {
      init() {
        let x = D(250);
        if (L1_MILESTONES.unl(9)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(13)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.6,
      pow: _ => inChal(4) ? 1.5 : 1
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(1).mul(10);
      if (L1_MILESTONES.unl(2)) r = r.mul(3);
      if (layerUnl(1)) r = r.mul(L1_POLISH.effProd(1));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][1]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      if (inChal(1)) return false
      return Decimal.gte(getBuyable(0), 1) || layerUnl(1);
    },
    name: "Generator",
  },
  2: {
    cost: {
      init() {
        let x = D(1e4);
        if (L1_MILESTONES.unl(9)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(13)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 1.8,
      pow: _ => inChal(4) ? 1.5 : 1
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(2).mul(100);
      if (layerUnl(1)) r = r.mul(L1_POLISH.effProd(2));
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][2]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      if (inChal(1)) return false
      return Decimal.gte(getBuyable(1), 10) || layerUnl(1);
    },
    name: "Producer",
  },
  3: {
    cost: {
      init: D(1e5),
      exp: _ => inChal(1) ? 4 : 10,
      pow: _ => inChal(4) ? 1.5 : 1,
      /*scaled: {
        start: 250,
        pow: 1.5
      }*/
    },
    limit: Infinity,
    prod() {
      let b = D(1)
      if (layerUnl(2)) b = b.add(L1_POLISH.eff(3)[0])
      if (inChal(3)) b = b.div(2)
      let r = getBuyable(3);
      if (L1_CONSUME.unl()) r = r.sub(L1_CONSUME.consumeEff());
      if (L1_CONSUME.unl()) r = r.add(tmp.darkTones[0]);
      return b.add(1).pow(r);
    },
    prodDisp(x) {
      return "x" + format(x);
    },
    unlocked() {
      return hasUpgrade(2);
    },
    confirm() {
      if (!(player.boost?.confirm ?? true)) return true;
      return confirm(
        "This will reset your progress for a booster, which doubles point gain. Are you sure?"
      );
    },
    onBuy() {
      if (!hasChaReward(3, 3) || !player.dark.chal.in) doLayer1Reset();
      tmp.auto.booster = true
    },
    name: "Booster"
  },
  4: {
    cost: {
      init() {
        let x = D(1e8);
        if (L1_MILESTONES.unl(9)) x = x.root(L1_POLISH.cheap());
        if (L1_MILESTONES.unl(13)) x = x.div(creatorPowerEff());
        return x;
      },
      exp: 2,
      pow: _ => inChal(4) ? 1.5 : 1
    },
    limit: Infinity,
    prod() {
      let r = getBuyable(4).mul(3e3);
      if (layerUnl(1)) r = r.mul(L1_POLISH.effProd(4));
      if (hasUpg(5, "normal")) r = r.mul(UPGRADES.normal.list[5].effect());
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][4]);
      return r;
    },
    prodDisp(x) {
      return "+" + format(x) + "/s";
    },
    unlocked() {
      if (inChal(1)) return false
      return L1_MILESTONES.unl(5);
    },
    name: "Factory",
  },
  5: {
    //Creator Enhancements unlock at Layer 3.
    cost: {
      init: D(1e80),
      exp: 1.5
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
      if (inChal(1)) return false
      return L1_MILESTONES.unl(14) || hasChaReward(3, 4);
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
  const cost = getBuyableCost(id);
  const bulk = getBuyableBulk(id);
  
  // also this thing is broken
  // buying it actually doesn't buy it
  if (id === 3 && hasUpg(1, "dark")) max = true;
  if (Decimal.gte(player.points, cost)) {
    if (!auto && buyables[id].confirm && !buyables[id].confirm()) return;
    if (!L1_MILESTONES.unl(13)) player.points = Decimal.sub(
      player.points,
      max ? getBuyableCost(id, bulk.sub(1)) : cost
    ).max(0);
    player.buyables[id] = max ? bulk : getBuyable(id).add(1);
    buyables[id].onBuy?.();
  }
}
function buyMaxBuyables() {
  for (const i of BUYABLE_KEYS)
    if (i !== "3" && buyables[i].unlocked()) buyBuyable(i, true);
}

function getBuyable(id) {
  return Decimal.fromValue_noAlloc(player.buyables[id] || 0);
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
      key == 3 ? "prestige1" : "canbuy",
    ]);
    tmp.cache[`buyableCost${key}`].writeText(format(getBuyableCost(key)));
    tmp.cache[`buyableBoostDiv${key}`].changeStyle(
      "display",
      layerUnl(1) && key != 3 ? "table-cell" : "none"
    );
    tmp.cache[`buyableScale${key}`].writeText(
      getScalingName(buyables[key].cost, getBuyable(key))
    )
  }
  updateCreatorPower()
  // what keeps happening with this
}

const UPGRADES = {
  normal: {
    dom: "upgrades",
    id: "upgrade",
    src: _ => player.upgrades,
    res: "p",
    spendable: _ => !L1_MILESTONES.unl(13) && player.modes.diff > 0,
    list: {
      0: {
        cost: D(1000),
        desc: "Gain more points based on total buildings bought.",
        effect() {
          let r = Object.values(player.buyables).reduce((a, b) =>
            Decimal.add(a, b)
          );
          if (!L1_MILESTONES.unl(3)) r = r.add(1).log10().pow(2).add(1);
          else r = r.add(1).sqrt();
          if (L1_MILESTONES.unl(6)) r = r.pow(1.3);
          if (L1_CONSUME.unl()) r = r.pow(tmp.darkTones[4]);
          return r;
        },
        unlocked: _ => true,
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      1: {
        cost: D(1e4),
        desc: "Gain more points based on your points.",
        effect() {
          if (hasUpg(3)) return D(player.points).add(1).pow(0.1).mul(1.5);
          return Decimal.add(player.points, 1).log10().add(1);
        },
        unlocked: _ => true,
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
      2: {
        cost: D(5e4),
        desc: "Unlock boosters.",
        effectDisplay() {
          return hasUpg(2) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: _ => hasUpg(1),
      },
      3: {
        cost: D(1e8),
        desc: "Upgrade 2 has a better formula.",
        effectDisplay() {
          return hasUpg(3) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: _ => hasUpg(2),
      },
      4: {
        cost: D(1e9),
        desc: "Makers produce points 10x faster.",
        effectDisplay() {
          return hasUpg(4) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: _ => hasUpg(3),
      },
      5: {
        cost: D(1.5e13),
        desc: "Factory production is multiplied by Boosters.",
        effectDisplay() {
          return hasUpg(5) ? "UNLOCKED" : "LOCKED";
        },
        unlocked: _ => hasUpg(4),
        effect() {
          return getBoosters().div(3).max(1)
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
        unlocked: _ => hasUpg(5),
        effect() {
          return D(L1_POLISH.totalamt()).div(4).add(1).pow(1.5);
        },
        effectDisplay() {
          return format(this.effect()) + "x";
        },
      },
    },
  },
};

function canAffordUpgrade(id, type = "normal") {
  const data = UPGRADES[type];
  const res = RESOURCES[data[id]?.res ?? data.res]
  return Decimal.gte(res.parent()[res.src], data.list[id].cost);
}
function buyUpg(id, type = "normal") {
  if (hasUpg(id, type)) return;
  if (!canAffordUpgrade(id, type)) return;

  const data = UPGRADES[type];
  const res = RESOURCES[data[id]?.res ?? data.res]
  const res_parent = res.parent()
  data.src()[id] = 1;
  if (data.spendable()) res_parent[res.src] = D(res_parent[res.src]).sub(data.list[id].cost);
}
function hasUpg(id, type = "normal") {
  const src = UPGRADES[type].src();
  return !!src[id] && src[id] !== "0";
}
function hasUpgrade(id, type) {
  return hasUpg(id, type);
}

function updateUpgrades(type = "normal") {
  const data = UPGRADES[type];
  const id = data.id;
  const list = data.list;

  for (const key of Object.keys(list)) {
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
    tmp.cache[`${id}Cost${key}`].writeText(format(list[key].cost,0));
    tmp.cache[`${id}Effect${key}`].writeText(list[key].effectDisplay());
  }
}

function setupUpgradeBuyables() {
  let html = `<tr><td></td><td></td><td></td><td></td><td>
        <button
          id="automationtoggle"
          onclick="player.automationtoggle=!player.automationtoggle"
        ></button>
        <button id="max_all" onclick="buyMaxBuyables()">(M) Buy max</button>
      </td><td id="buyableBoostDiv">
        <div id="buyableBoost"></div>
        <button
          id="autoenhance"
          onclick="openModal('boost')"
        >Open Auto</button>
        <button id="polish_respec" onclick="L1_POLISH.respec()">Respec</button>
      </td></tr>`
      //header

  html += htmlFor(
    buyableOrder,
    function (key) {
      const value = buyables[key];
      const name = value.name
      return `<tr id="mainBuyable${key}">
        <td><img class="buildimg" id="buyableImg${key}" src="${imageMap(
          // TODO: shrink image
          name.toLowerCase()+"_default"
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
            ${key == 3 ? "(B) " : ""}
 	              Cost: 
            <span
             id="buyableCost${key}"></span> 
            points
          </button>
        </td>
        <td><div id="buyableBoostDiv${key}">
            ${key === 5 ? `` : `<button 
              id="buyableBoost${key}" 
              class="upgbutton cannotbuy"
              onclick="L1_POLISH.buy(${key})">
                  (0) Enhance: ??? boosters
            </button>`}
        </div></td>
        <td id="buyableBoostEff${key}" class="buildboosttext" style="font-size: 10px">
          ${key === 5 ? `<span id="creatorPower"></span> Creator Power<br>(/<span id="creatorPowerEff"></span> building costs)` :
          key === 3 ? `Enhance boost: Increase the base by <span id="buyableFlat${key}"></span>` :
          `Enhance boost: <span id="buyableFlat${key}"></span>x (additive)<br>
          For every <span id="buyableRepeated${key}"></span> buildings, double production.`}
        </td>
      </tr>`;
    }
  );
  
  html += `<tr>
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
  
  tmp.cache.buildings.writeHTML(html)

  for (const index of Object.keys(UPGRADES)) {
    let data = UPGRADES[index];
    let id = data.id;
    tmp.cache[data.dom].writeHTML(htmlFor(
      data.list,
      (value, key) => `
         <button 
           text-align="center"
           id="${id}Button${key}" 
           class="u cannotbuy"
           onclick="buyUpg(${key}, '${index}')">
           ${value.desc}<br><br>
           Cost: 
           <span id="${id}Cost${key}"></span> 
           <br><br>
           Currently: 
           <span
             id="${id}Effect${key}">
           </span>
         </button>
       `+(key % 4 == 3 ? `<br>` : ``)
    ));
  }
}

//Resources
const RESOURCES = {
  p: {
    name: "Points",
    parent: _ => player,
    src: "points"
  },
  dm: {
    name: "Dark Matter",
    parent: _ => player.dark.res,
    src: "dm"
  }
}

//Extra
function updateCreatorPower() {
  tmp.cache.creatorPower.writeText(format(player.creatorPower))
  tmp.cache.creatorPowerEff.writeText(format(creatorPowerEff()))
}

function creatorPowerEff() {
  let exp = D(0.7)
  let base = D(player.creatorPower).add(1)

  if (L2_RECALL.unl()) exp = exp.mul(tmp.darkRecall.df)
  return base.pow(exp)
}