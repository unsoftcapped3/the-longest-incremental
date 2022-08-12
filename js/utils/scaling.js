const SCALINGS = {
  //tiers: scaled
  main: {
    //exp^level^pow*init
    //or level^pow*init

    cost(d, lvl) {
      let r = D(lvl)

      if (d.pow) r = r.pow(evalVal(d.pow))
      if (d.exp) r = D(evalVal(d.exp)).pow(r)
      r = r.mul(evalVal(d.init))
      return r
    },
    bulk(d, res) {
      let lvl = D(res)

      lvl = lvl.div(evalVal(d.init))
      if (d.exp) r = lvl.log(evalVal(d.exp))
      if (d.pow) r = lvl.root(evalVal(d.pow))

      return r
    }
  },
  scaled: {
    cost(d, lvl) {
      let r = D(lvl)
      let start = evalVal(d.start)
      let pow = d.pow ? evalVal(d.pow) : 1.5
      if (r.gt(start)) r = r.div(start).pow(pow).mul(start)

      return r
    },
    bulk(d, res) {
      let lvl = D(res)
      let start = evalVal(d.start)
      let pow = d.pow ? evalVal(d.pow) : 1.5
      if (lvl.gt(start)) lvl = lvl.div(start).root(pow).mul(start)

      return lvl
    }
  },

  //DOM
  setupDOM() {
    document.getElementById("scale_info").innerHTML = htmlFor(
      buyableOrder, (key) => {
        const value = buyables[key]
        return `
        <div id="scaleBuyable${key}">
          ${value.name}: Starts at 
          <span id="scaleBuyableStart${key}">
            ${format(getBuyableScaleStart(key),0)}
          </span>, 
          ^<span id="scaleBuyablePower${key}">
            ${format(getBuyableScalePower(key))}
          </span> to amount used in cost formula
        </div>
        `
      }
    )
  },
  updateDOM() {
    let unl = false
    for (const key of BUYABLE_KEYS) {
      let scaled = isBuyableScaled(key)
      if (scaled) unl = true
      tmp.cache[`scaleBuyable${key}`].changeStyle("display", scaled ? "block" : "none")
      tmp.cache[`scaleBuyableStart${key}`]
        .writeText(format(getBuyableScaleStart(key),0))
      tmp.cache[`scaleBuyablePower${key}`]
        .writeText(format(getBuyableScalePower(key)))
    }
    // we need to move this somewhere else
    // scaling tab shows the statistics of scalings, so keep it in stats.
    // we can't cause this shows when it shows up
    // but this only updates it when you are in here
    // so paradox 200
  }
}

function getCost(data, lvl) {
  let r = D(lvl)
  if (data.scaled) r = SCALINGS.scaled.cost(data.scaled, r)
  return SCALINGS.main.cost(data, r)
}

function getBulk(data, res) {
  let r = D(res)
  r = SCALINGS.main.bulk(data, r)
  if (data.scaled) r = SCALINGS.scaled.bulk(data.scaled, r)
  return r.floor().add(1)
}

function startsAt(data) {
  return data.scaled ? evalVal(data.scaled.start) : D(1/0)
}

function isScaled(data, amt) {
  return D(amt).gt(startsAt(data))
}

function getScalingName(data, amt) {
  let prefix = ""
  if (data.scaled && D(amt).gt(evalVal(data.scaled.start))) prefix = "Scaled"
  return prefix
}