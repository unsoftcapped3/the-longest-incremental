const DARK_REQ = D(Math.E).pow(100);

function doLayer2Reset(force) {
  if (!force) {
    if (player.dark.times === 0) {
      player.dark.unl = true;
      notify();
    }
    player.dark.times++;
    player.dark.amt = player.dark.amt.add(D(1));
  } else player.dark.restart++;
  player.dark.time = 0;

  player.buyables[3] = D(0);
  player.boost.maxPoints = D(0);
  player.boost.bu = {};
  player.boost.consume = {
    amt: D(0),
    eng: D(0),
    upg: {},
  };

  player.points = D(0);
  doLayer1Reset(true);
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
      dm: D(0)
    },
    upg: [],
    //abilities is in player
  };
}

function updateLayer2DOM() {
  if (!tmp.cache) return;
  tmp.cache.pre_darken.changeStyle("display", player.dark.unl ? "none" : "");
  tmp.cache.stabs_dark.changeStyle("display", player.dark.unl ? "" : "none");
  tmp.cache.darken_resetdesc.writeText(
    canLayer2() ? "Darken the sun." : "Req: " + format(DARK_REQ)
  );
  updateBuyThings(`darken_btn`, canLayer2(), ["cannotbuy", "prestige2"]);
}

//UPGRADES
L2_UPGRADES = () => {
  dom: "darkUpgs",
  id: "darkUpg",
  src: () => player.dark.upg,
  res_src: () => player.dark.res,
  res: "dm",
  list: {}
}


//ABILITIES


//RECALL
let L2_RECALL