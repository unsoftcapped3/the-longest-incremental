const SCALINGS = {
  //tiers: scaled
  main: {
    //exp^(level*mul)^pow*init
    //or (level*mul)^pow*init

    cost(d, lvl) {
      let r = D(lvl);
      if (d.mul) r = r.mul(evalVal(d.mul));
      if (d.pow) r = r.pow(evalVal(d.pow));
      if (d.exp) r = D(evalVal(d.exp)).pow(r);
      r = r.mul(evalVal(d.init));
      return r;
    },
    bulk(d, res) {
      let lvl = D(res);
      lvl = lvl.div(evalVal(d.init));
      if (d.exp) lvl = lvl.log(evalVal(d.exp));
      if (d.pow) lvl = lvl.root(evalVal(d.pow));
      if (d.mul) lvl = lvl.div(evalVal(d.mul));
      return lvl;
    }
  },
  scaled: {
    cost(d, lvl) {
      let r = D(lvl);
      let start = evalVal(d.start);
      let pow = d.pow ? evalVal(d.pow) : 1.5;
      if (r.gt(start)) r = r.div(start).pow(pow).mul(start);
      return r;
    },
    bulk(d, res) {
      let lvl = D(res);
      let start = evalVal(d.start);
      let pow = d.pow ? evalVal(d.pow) : 1.5;
      if (lvl.gt(start)) lvl = lvl.div(start).root(pow).mul(start);
      return lvl;
    }
  },

  //DOM
  setupDOM() {
    tmp.cache.scale_info.writeHTML(htmlFor(
      buyableOrder, (key) => {
        const value = buyables[key]
        return `
        <div id="scaleBuyable${key}">
          ${value.name}: Starts at 
          <span id="scaleBuyableStart${key}"></span>, 
          ^<span id="scaleBuyablePower${key}"></span> to amount used in cost formula
        </div>
        `
      }
    ))
  },
  updateDOM() {
    for (const key of BUYABLE_KEYS) {
      const scaled = isBuyableScaled(key)
      tmp.cache[`scaleBuyable${key}`].changeStyle("display", scaled ? "block" : "none")
      tmp.cache[`scaleBuyableStart${key}`]
        .writeText(formatWhole(getBuyableScaleStart(key)))
      tmp.cache[`scaleBuyablePower${key}`]
        .writeText(format(getBuyableScalePower(key)))
    }
  }
}

function getCost(data, level) {
  const r = data.scaled ? SCALINGS.scaled.cost(data.scaled, D(level)) : D(level);
  return SCALINGS.main.cost(data, r);
}

function getBulk(data, res) {
  let r = D(res);
  r = SCALINGS.main.bulk(data, r);
  if (data.scaled) r = SCALINGS.scaled.bulk(data.scaled, r);
  return r.floor().add(Decimal.dOne);
}

function startsAt(data) {
  return data.scaled ? evalVal(data.scaled.start) : Decimal.dInf;
}

function isScaled(data, amt) {
  return D(amt).gt(startsAt(data));
}

function getScalingName(data, amt) {
  let prefix = "";
  if (data.scaled && D(amt).gt(evalVal(data.scaled.start))) prefix = "Scaled";
  return prefix;
}