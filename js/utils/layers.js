const LAYERS = {
  /*
  n: {
    name: "Name",
    pharse: "???,
    confirm: "Are you sure?",
    ani: _ => layerNotify(n),

    loc: "something",
    setup() {
      return {}
    },

    can: _ => true,
    gain: _ => D(0),
    onGain(x) {
      const p = getLayerPlayer(0)
      p.amt = D(p.amt).add(x)
    }

    reset() {
      //should reset prior layers
    },
    onReset() {
      //testing
    },
  }
  */
}

//HELPER
function setupLayer(x) {
  const d = Object.assign({
    time: 0,
    times: 0,
    restart: 0,
    maxPoints: D(0),
    confirm: true
  }, LAYERS[x].setup())

  player[LAYERS[x].loc] = d
  return d
}

function setupLayers(x) {
  for (let i = 1; i <= x; i++) setupLayer(i)
}

function getLayerPlayer(id) {
  return player?.[LAYERS[id].loc]
}

function layerUnl(id) {
  return getLayerPlayer(id)?.unl
}

function resetStatsOnLayer(id, force) {
  const p = getLayerPlayer(id)
  if (!p) return
  p[force ? "restart" : "times"]++
  p.time = 0
}

function doLayer(id) {
  const p = getLayerPlayer(id)
  const d = LAYERS[id]
  if (!d.can()) return
  if ((p?.confirm ?? true) && !confirm(d.confirm)) return
  doLayerReset(id)
}

function doLayerReset(n, force) {
  const d = LAYERS[n]
  if (!force) {
    let p = getLayerPlayer(n)
    if (!p) p = setupLayer(n)
    if (tmp.layer < n) d.ani()
    if (d.onGain) d.onGain(d.gain())
    p.unl = true
    d.onReset()
  }
  for (let i = n; i > 0; i--) {
    const p = getLayerPlayer(i)
    if (i != n) {
      p.maxPoints = D(0)
      delete p.unl
    }
    LAYERS[i].reset()
    resetStatsOnLayer(i, force)
    force = true
  }
}

//OTHERS
function getHighestLayer() {
  for (let i = Object.keys(LAYERS).length; i > 0; i--) {
    if (layerUnl(i)) return i
  }
  return 0
}

function layerNotify(layer) {
  tmp.cache.layerflash.show();
  tmp.cache.layerunlock.show();
  tmp.cache.layerunlock.changeStyle("opacity", 1);
  tmp.cache.layernum.writeText(`Layer ${layer} unlocked: ${LAYERS[layer].name}!`);
  tmp.cache.layerreward.writeText(`You have also unlocked ${LAYERS[layer].reward}!`);
}

function dismissLayerNotify() {
  tmp.cache.layerunlock.changeStyle("opacity", 0);
  setTimeout(_ => tmp.cache.layerunlock.hide(), 2000);
}
