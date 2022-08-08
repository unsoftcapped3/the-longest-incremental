const playerHandler = {
  get(target, key) {
    const value = target[key];
    if (value && !value[NaNToken] && (value.constructor === Object || Array.isArray(value))) {
      value[NaNToken] = `${target[NaNToken]}.${key}`;
      target[key] = new Proxy(value, playerHandler);
    }
    return value;
  },
  set(target, key, value) {
    if (
      Number.isNaN(value) ||
      (value instanceof Decimal && Decimal.isNaN(value))
    ) {
      console.warn(`Attempted to set ${target[NaNToken]}.${key} to NaN value`);
      clearInterval(saveInterval);
      clearInterval(interval);
      throw new Error("Attempted to set a NaN value. See above, and go fix those formulas.");
    }
    target[key] = value;
    return true;
  }
};

const NaNToken = Symbol("NaNPath");

function setup() {
	return {
    points: D(10),
    buyables: {
      0: D(0),
      1: D(0),
      2: D(0),
			3: D(0),
			4: D(0)
    },
    upgrades: {},

    boost: setupLayer1(),
    dark: setupLayer2(),
	
		ach: [],
    stats: {
      time: 0,
      max: D(0),
    },
    theme: "default",
    automationtoggle: true,
    lastTick: Date.now(),
    tab: "main",
    stab: {
      main: "upg",
      stats: "l1",
      settings: "main",
			dark: "upg",
			absurd: false,
    },
    [NaNToken]: "player"
	}
}
let player = new Proxy(setup(), playerHandler)

function production() {
  let gain = new Decimal(0)
  for (const b of Object.keys(buyables)) {
    if (b !== "3") gain = gain.add(buyables[b].prod())
  }
  gain = gain.mul(getAchPower())
	gain = gain.mul(buyables[3].prod())
  for (const u of [0, 1, 6]) {
    if (hasUpg(u)) gain = gain.mul(upgrades[u].effect())
  }
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[2])
	if (L1_CONSUME.unl()) gain = gain.mul(tmp.darkTones[3])
  return gain
}

const buyableOrder = [0, 1, 2, 4, 5, 3];
const BUYABLE_KEYS = Object.keys(buyables);
const buyables = {
  0: {
    cost(b) {
      return Decimal.pow(1.4, b || getBuyable(0)).times(10)
    },
    bulk() {
      return player.points.div(10).log(1.4).floor().add(1)
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(0))
      if (hasAch(8)) r = r.mul(1.09)
      if (hasUpg(4)) r = r.mul(10)
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(0))
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][0])
      return r
    },
    prodDisp(x) {
      return "+" + format(x) + "/s"
    },
    unlocked() {
      return true
    },
    name: "Maker",
  },
  1: {
		initCost() {
			let x = D(25)
			if (L1_MILESTONES.unl(8)) x = x.root(Math.sqrt(L1_POLISH.flat(4)))
			return x.mul(10)
		},
    cost(b) {
      return Decimal.pow(1.6, b || getBuyable(1)).times(this.initCost())
    },
    bulk() {
      return player.points.div(this.initCost()).log(1.6).floor().add(1)
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(1)).mul(10)
      if (L1_MILESTONES.unl(1)) r = r.mul(3)
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(1))
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][1])
      return r
    },
    prodDisp(x) {
      return "+" + format(x) + "/s"
    },
    unlocked() {
      return Decimal.gte(getBuyable(0), 1) || player.boost.unl;
    },
    name: "Generator",
  },
  2: {
		initCost() {
			let x = D(1e3)
			if (L1_MILESTONES.unl(8)) x = x.root(Math.sqrt(L1_POLISH.flat(4)))
			return x.mul(10)
		},
    cost(b) {
      return Decimal.pow(1.8, b || getBuyable(2)).times(this.initCost())
    },
    bulk() {
      return player.points.div(this.initCost()).log(1.8).floor().add(1)
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(2)).mul(100)
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(2))
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][2])
      return r
    },
    prodDisp(x) {
      return "+" + format(x) + "/s"
    },
    unlocked() {
      return Decimal.gte(getBuyable(1), 10) || player.boost.unl;
    },
    name: "Producer",
  },
  3: {
    cost() {
      let amt = getBuyable(3)
			// if (amt.gte(15)) amt = amt.sub(14).pow(1.5).add(14)
			// like, same as "scaled" in DI, we would do (x-a)^2+a
      return Decimal.pow(10, amt).times(1e5)
    },
    bulk() {
      return player.points.div(1e5).log10().floor().add(1)
    },
    limit: Infinity,
    prod() {
			let b = D(getBuyable(3))
			if (L1_CONSUME.unl()) b = b.sub(L1_CONSUME.consumeEff())
			if (L1_CONSUME.unl()) b = b.add(tmp.darkTones[0])
      return Decimal.pow(D(2).add(L1_POLISH.eff(3)), b);
    },
    prodDisp(x) {
      return "x" + format(x)
    },
    unlocked() {
      return hasUpgrade(2);
    },
    confirm() {
			if(!player.boost.confirm) return true
      return confirm("This will reset your progress for a booster, which doubles point gain. Are you sure?")
    },
    onBuy() {
      doLayer1Reset()
    },
    name: "Booster",
  },
  4: {
		initCost() {
			let x = D(1e7)
			if (L1_MILESTONES.unl(8)) x = x.root(Math.sqrt(L1_POLISH.flat(4)))
			return x.mul(10)
		},
    cost(b) {
      return Decimal.pow(2, b || getBuyable(4)).times(this.initCost())
    },
    bulk() {
      return player.points.div(this.initCost()).log(2).floor().add(1)
    },
    limit: Infinity,
    prod() {
      let r = D(getBuyable(4)).mul(3e3)
      if (player.boost.unl) r = r.mul(L1_POLISH.eff(4))
			if (hasUpg(5)) r=r.mul(D(player.buyables[3]).add(1))
      if (L1_CONSUME.unl()) r = r.mul(tmp.darkTones[1][4])
      return r
    },
    prodDisp(x) {
      return "+" + format(x) + "/s"
    },
    unlocked() {
      return L1_MILESTONES.unl(4);
    },
    name: "Factory",
  },
  5: {
    cost(b) {
      return D(Infinity)
    },
    bulk() {
      return D(0)
    },
    limit: Infinity,
    prod() {
      return D(0)
    },
    prodDisp(x) {
      return "+" + format(x) + "/s"
    },
    unlocked() {
      return layer_placeholder(3);
    },
    name: "Creator",
  },
};
function canAffordBuyable(id) {
  return Decimal.gte(player.points, buyables[id].cost())
}
function buyBuyable(id, max) {
  const dict = buyables
  const data = dict[id]

  const src = player.buyables
  const cost = data.cost()
	const bulk = data.bulk()

  //if (Decimal.gte(src[id], data.limit)) return;
  if (Decimal.gte(player.points, cost)) {
    if (data.confirm && !data.confirm()) return
    player.points = Decimal.sub(player.points, max ? data.cost(bulk.sub(1)) : cost).max(0);
    src[id] = max ? bulk : Decimal.add(src[id], 1);
    if (data.onBuy) data.onBuy()
  }
}
function buyMaxBuyables() {
	for (var i = 4; i > -1; i--) if (i != 3 && buyables[i].unlocked()) buyBuyable(i, true)
}
function getBuyable(id) {
  return D(player.buyables[id])
}
function updateBuyables() {
  for (const key of BUYABLE_KEYS) {
    tmp.cache[`mainBuyable${key}`]
      .changeStyle('display', buyables[key].unlocked() ? 'table-row' : 'none')
    tmp.cache[`buyableAmount${key}`].writeText(
      format(player.buyables[key], 0)
    )
    tmp.cache[`buyableProd${key}`].writeText(
      buyables[key].prodDisp(buyables[key].prod())
    )
    updateBuyThings(`buyableButton${key}`, canAffordBuyable(key), ['cannotbuy', key == 3 ? 'prestige' : 'canbuy'])
    tmp.cache[`buyableCost${key}`]
      .writeText(format(buyables[key].cost()));
    tmp.cache[`buyableBoostDiv${key}`]
      .changeStyle('display', player.boost.unl && key != 3 ? 'table-cell' : 'none')
    tmp.cache[`buyableBoostEff${key}`]
      .changeStyle('display', player.boost.unl && L1_POLISH.amt(key) && key != 3 ? 'table-cell' : 'none')
  }
}

const UPGRADE_KEYS = Object.keys(upgrades);
const upgrades = {
  normal: {
    dom: "upgrades",
    id: "upgrade",
    src: () => player.upgrades,
    res_src: () => player,
    res: "points",
    list: {
      0: { //upgrade
        cost: D(1000),
        desc: "Gain more points based on total buildings bought.",
        effect() {
          let r = Object.values(player.buyables).reduce((a, b) => Decimal.add(a, b))
          if (!L1_MILESTONES.unl(2)) r = r.add(1).log10().pow(2).add(1)
          else r = r.add(1).sqrt()
          if (L1_MILESTONES.unl(5)) r = r.pow(1.3)
          if (L1_CONSUME.unl()) r = r.pow(tmp.darkTones[4])
          return r
        },
        unlocked: () => true,
        effectDisplay() { return format(upgrades[0].effect()) + "x" }
      },
      1: {
        cost: D(1e4),
        desc: "Gain more points based on your points.",
        effect() {//why not make third generator first because that will the 3rd upgrade
          if (hasUpg(3)) return D(player.points).add(1).pow(.1).mul(1.5)
          return Decimal.add(player.points, 1).log10().add(1)
        },
        unlocked: () => true,
        effectDisplay() { return format(upgrades[1].effect()) + "x" }
      },
      2: {
        cost: D(5e4),
        desc: "Unlock boosters.", // placeholder
        effectDisplay() { return hasUpg(2) ? "UNLOCKED" : "LOCKED" },
        unlocked: () => hasUpg(1)||hasUpg(2)
      },
      3: {
        cost: D(1e8),
        desc: "Upgrade 2 has a better formula.",
        effectDisplay() { return hasUpg(3) ? "UNLOCKED" : "LOCKED" },
        unlocked: () => hasUpg(2)||hasUpg(3)
      },
      4: {
        cost: D(1e9),
        desc: "Makers produce points 10x faster.",
        effectDisplay() { return hasUpg(4) ? "UNLOCKED" : "LOCKED" },
        unlocked: () => hasUpg(3)||hasUpg(4)
      },
      5: {
        cost: D(1.5e13),
        desc: "Factory production is multiplied by your total amount of boosters.",
        effectDisplay() { return hasUpg(5) ? "UNLOCKED" : "LOCKED" },
        unlocked: () => hasUpg(4)||hasUpg(5),
        effect() {
          return D(player.buyables[3]).add(1)
        },
        effectDisplay() { return format(upgrades[5].effect()) + "x" }
      },
      6: {
        cost: D(1e28), // can be changed upon consume balancing
        desc: "Gain more points based on total Enhances.",
        effectDisplay() { return hasUpg(6) ? "UNLOCKED" : "LOCKED" },
        unlocked: () => hasUpg(5)||hasUpg(6),
        effect() {
          return D(L1_POLISH.totalamt()).div(3).add(1).pow(1.5) 
        },
        effectDisplay() { return format(upgrades[6].effect()) + "x" }
      },
    }
  }
}

function canAffordUpgrade(id, type) {
  const data = upgrades[type]
  return Decimal.gte(data.res_src()[data.res], data.list[id].cost)
}
function buyUpg(id, type) {
  if (hasUpg(id, type)) return
  if (!canAffordUpgrade(id, type)) return

  const data = upgrades[type]
  const res_src = data.res_src()
  data.src[id] = 1
  res_src[data.res] = res_src[data.res].sub(data.list[id].cost)
}
function hasUpg(id, type) {
  const src = upgrades[type].src()
  return src[id] && src[id] !== "0"
}
function hasUpgrade(id, type) {
  return hasUpg(id, type)
}
function updateUpgrades(type) {
  const data = upgrades[type]
  const id = data.id
  const list = data.list
  const keys = Object.keys(list)

  for (const key of keys) {
    tmp.cache[`${id}Button${key}`][(hasUpg(key, type) ? 'add' : 'remove') + 'Classes']("bought")
    tmp.cache[`${id}Button${key}`]
      .changeStyle('visibility', list[key].unlocked() ? 'visible' : 'hidden')
    if (!hasUpg(key, type)) {
      updateBuyThings(`${id}Button${key}`, canAffordUpgrade(key, type))
    } else {
      tmp.cache[`${id}Button${key}`]
        .removeClasses('canbuy', 'cannotbuy')
    }
    tmp.cache[`${id}Effect${key}`].writeText(list[key].effectDisplay());
  }
}

function setupUpgradeBuyables() {
  document.getElementById("buildings").innerHTML =
    htmlFor(buyableOrder, function(key) {
      value = buyables[key]
      return `<tr id="mainBuyable${key}">
     <td> <img id="${value.name.toLowerCase()}img" src="${imageMap(value.name)}"></td>
        <td style='text-align: left; width: 120px'><b>${value.name}</b>:</td>
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
        <td id="buyableBoostDiv${key}">
          <button 
            id="buyableBoost${key}" 
            class="upgbutton cannotbuy"
            onclick="L1_POLISH.buy(${key})">
 	              (0) Enhance: ??? boosters
          </button>
        </td>
        <td id="buyableBoostEff${key}" class="buildboosttext" style="font-size: 10px">
          Enhance boost: <span id="buyableFlat${key}"></span>x (additive)<br>
          Every <span id="buyableRepeated${key}"></span> buildings, do x2 production.
        </td>
      </tr>`});

  for (const index of UPGRADE_KEYS) {
    let data = upgrades[index]
    let id = data.id
    document.getElementById(data.dom).innerHTML =
      htmlFor(data.list, (value, key) => `
         <button 
           text-align="center"
           id="${id}Button${key}" 
           class="u cannotbuy
           onclick="buyUpg(${key}, ${id})">
           ${value.desc}<br><br>
           Cost: 
           <span>
             ${format(value.cost)}
           </span> 
           points<br><br>
           Currently: 
           <span
             id="${id}Effect${key}">
           </span>
         </button>
       `);
  }
}

//FUTURE
function layer_placeholder(x) {
	return false
}

document.onkeypress = function (e) {
    switch (e.key){
			case "m":
				buyMaxBuyables()
				break;
		}
			
};