//rediscover
let rediscover = {
  l0: {
    layer: 0,
    name: "The Beginning",
    unl: () => true,
    goal: () => hasUpg(2, "normal") && D(player.points).gte(1e5),
    goalDesc: () => format(1e5) + " points and Upgrade 3",
    start() {
      //nothing
    }
  },
  l1_boost: {
    layer: 1,
    name: "Boosters",
    unl: () => true,
    goal: () => L1_CONSUME.unl(),
    goalDesc: () => format(13, 0) + " Boosters",
    start() {
      player.boost.unl = true
      player.boost.times = 1
      player.buyables[3] = D(1)
      player.upgrades = {2: 1}
    }
  },
  l1_consume: {
    layer: 1,
    name: "Consumption",
    unl: () => true,
    goal: () => D(player.points).gte(DARK_REQ),
    goalDesc: () => format(DARK_REQ) + " points",
    start() {
      player.boost.unl = true
      player.boost.times = 13
      player.buyables[3] = D(13)
      player.upgrades = {2: 1}
    }
  },
  l1_all: {
    layer: 1,
    name: "All Together",
    unl: () => true,
    goal: () => D(player.points).gte(DARK_REQ),
    goalDesc: () => format(DARK_REQ) + " points",
    start() {
      player.boost.unl = true
      player.boost.times = 1
      player.buyables[3] = D(1)
      player.upgrades = {2: 1}
    }
  },

  /*l2_dark: {
    goal: () => hasUpg(2, "dark"),
    start() {
      player.boost.unl = true
      player.boost.times = 40
      player.dark.unl = true
      player.dark.times = 1
      player.dark.res.dm = D(1)
    }
  },
  l2_recall: {
    goal: () => hasUpg(7, "dark"),
    start() {
      player.boost.unl = true
      player.boost.times = 100
      player.dark.unl = true
      player.dark.times = 3
      player.dark.upg = {0: 1, 1: 1, 2: 1}
    }
  },
  l2_alloy: {
    goal: () => hasUpg(11, "dark"),
    start() {
      player.boost.unl = true
      player.boost.times = 100
      player.dark.unl = true
      player.dark.times = 3
      player.dark.res.dm = D(500)
      player.dark.upg = {0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1}
    }
  },
  l2_chal: {
    goal: () => false,
    start() {
      player.boost.unl = true
      player.boost.times = 100
      player.dark.unl = true
      player.dark.times = 3
      player.dark.res.dm = D(1e6)
      player.dark.upg = {0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1}
    }
  },*/
}

function startRediscover(loc) {
  save()

  meta.rd.on = true
  meta.rd.has = true

  reset()
  setupLayers(rediscover[loc].layer)
  rediscover[loc].start()
  player.modes = { diff: Number(tmp.cache.difficulty.getAttr("value")), rd: loc }

  saveMeta()
  closeModal()
  notifyMessage("Rediscovery started!")
}

function continueRediscover() {
  save()

  meta.rd.on = true
  loadSave()

  saveMeta()
  closeModal()
  notifyMessage("Rediscovery continued")
}

function finishRediscover() {
  notifyMessage("Rediscovery finished! Time: " + formatTime(player.stats.time))
  pushRediscover(player.modes.rd, player.modes.diff, { time: player.stats.time })

  meta.rd.on = false
  canSave = false
  switchSave(meta.save)
  localStorage.removeItem("ilig_rd")
  delete meta.rd.has
}

function pushRediscover(loc, diff, data) {
  //[time]
  let id = loc + "_" + diff
  meta.rd[id] = {
    time: Math.min((meta.rd[id] && meta.rd[id].time) || 1/0, data.time),
    //clicks: Math.min((meta.rd[id] && meta.rd[id].clicks) || 1/0, data.clicks)
  }
}