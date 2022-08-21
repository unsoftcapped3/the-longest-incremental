const ver = {
  release: 0,
  layers: 2,
  content: 1,
  patch: 0,
  beta: false
};

function compressSave(data) {
  return LZString.compressToBase64(JSON.stringify(data));
}

function decompressSave_old(data) {
  return JSON.parse(LZString.decompressFromUTF16(data));
}

function decompressSave(data) {
  return JSON.parse(LZString.decompressFromBase64(data));
}

function getVer(x) {
  if (typeof x === "number") {
    return {
      release: 0,
      layers: Math.round(x * 10),
      content: 0
    };
  }
  if (typeof x === "string") {
    x = x.split(".")
    return {
      release: parseInt(x[0]) || 0,
      layers:  parseInt(x[1]) || 0,
      content: parseInt(x[2]) || 0
    };
  }
  return x
}

function gtVer(x, y) {
  x = getVer(x)
  y = getVer(y)

  return (
    x.release > y.release ||
    (x.release === y.release &&
      (x.layers > y.layers || 
       (x.layers === y.layers && x.content > y.content)))
  )
}

function verName(x) {
  return (
    "v" +
    x.release +
    "." +
    x.layers +
    (x.content ? "." + x.content : "") +
    (x.patch ? "-p" + x.patch : "") +
    (x.beta ? "-beta" : "")
  );
}

function deepCopy(object, data) {
  if (!data) return;
  // merge data into object
  for (const key of Reflect.ownKeys(data)) {
    if (object[key] && object[key].constructor === Object)
      deepCopy(object[key], data[key]);
    else if (object[key] === undefined || object[key] === null) object[key] = data[key];
  }
  return object;
}

async function exportSave() {
  if (!canSave) {
    notifyMessage("Nice try.");
    return;
  }
  try {
    await navigator.clipboard.writeText(compressSave(player));
    notifyMessage("Save successfully copied to clipboard.");
  } catch (e) {
    notifyMessage("Your save could not be exported due to an error. Sorry!");
    console.error(e);
  }
}

async function downloadSave() {
  if (!canSave) {
    notifyMessage("Nice try.");
    return;
  }
  try {
    const file = new Blob([compressSave(player)], { type: "text/plain" });
    window.URL = window.URL || window.webkitURL;
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(file);
    a.download = `The Longest Incremental - ${new Date().toGMTString()}.txt`;
    a.click();
    notifyMessage("Save successfully downloaded.");
  } catch (e) {
    notifyMessage("Your save could not be exported due to an error. Sorry!");
    console.error(e);
  }
}

function importSave(save) {
  //returns true if success
  try {
    save = save || prompt("paste your save here");
    if (!save) return false;

    /*if (player.modes) {
      const mode = {...player.modes}
      parseSave(save)
      player.modes = player.modes ?? mode
    } else*/
    parseSave(save)
    onLoaded()

    return true
  } catch (error) {
    alert("Invalid save!");
    console.error(error);

    return false
  }
}

function parseSave(save) {
  data = decompressSave_old(save) ?? decompressSave(save);
  if (data.chal) {
    delete data.chal
    delete data.chalIn
    delete data.chalForceIn
    delete data.chalLayerIn
  }
  if (data.boost) {
    data.boost = deepCopy(data.boost, setupLayer(1))
    delete data.boost.amt
  }
  if (data.dark) {
    data.dark = deepCopy(data.dark, setupLayer(2))
    if (data.abilities) {
      data.dark.ab = data.abilities
      data.dark.ab.times = data.dark.abilitytimes
      delete data.dark.abilitytimes
    }
    if (data.dark.recall !== undefined) {
      data.dark.rc = {
        times: data.dark.recall,
        f0: data.dark.recallFactors,
        fMax: data.dark.recallMax
      }
      delete data.dark.recall
      delete data.dark.recallFactors
      delete data.dark.recallMax
    }
    if (Array.isArray(data.dark.chal)) delete data.dark.chal
    delete data.dark.has
    delete data.dark.did
    delete data.dark.chalIn
    delete data.dark.chalForceIn
    delete data.dark.chalLayerIn
  }
  delete data.abilities

  player = new Proxy(deepCopy(data, setup()), playerHandler);
}

let canSave = false;
function save(manual) {
  if (!canSave) return;
  localStorage.setItem(getSaveId(), compressSave(player));
  if (manual) notifyMessage("Game saved");
}

function load() {
  try {
    loadMeta();
    setupHTML(); //load first
    loadSave(true);
    setupRandom();

    tmp.cache.loading_page.hide();
    if (player.tab != "dark") tmp.cache.dark_bg.hide();
    tmp.cache.game_modal.show();
    tmp.cache.ver.writeText(verName(ver));
    loadInterval();
  } catch (e) {
    canSave = false;
    console.error(e);
  }
}

function loadSave(init) {
  let save;
  let old = localStorage.getItem("gaming");
  if (old !== null) {
    save = old
    localStorage.setItem("tlig_0", old);
    localStorage.removeItem("gaming");
  } else {
    save = localStorage.getItem(getSaveId());
  }

  if (!importSave(save) && init) reset()
}

function onLoaded() {
  tmp.cache.alloyPercentage.changeAttr("value", player.dark?.alloyPercentage ?? 50);
  L2_RECALL.channel = 0;
  updateChalIn();

  let time = Date.now()
  if (!player.offline.off) player.offline.time = (time - player.lastTick) / 1e3
  player.lastTick = time

  if (gtVer(ver, player.ver)) {
    player.hasWon = false;
    notifyMessage("The game has been successfully updated!");
    openModal("update");
  }
  player.ver = ver

  //DISPLAYS + MUSIC
  updateTmp()
  resetTabs();
  setTheme(player.theme);
  updateIcons();
  getMusic();
}

function newSave(modes) {
  save();
  let newId = 0;
  while (meta.saves.includes(newId)) newId++;
  delete meta.rd.on;
  meta.save = newId;
  meta.saves.push(newId);
  reset();
  if (modes.diff === -1) delete modes.diff
  player.modes = modes;
  saveMeta();
  notifyMessage("Save created");
}

function switchSave(x) {
  save();
  delete meta.rd.on;
  meta.save = x;
  loadSave();
  saveMeta();
  notifyMessage("Save loaded");
}

function deleteSave(id) {
  if (!confirm("Are you really sure do you want to delete this?")) return;
  const newList = [];
  for (const [i, save] of Object.entries(meta.saves)) {
    if (save === id) localStorage.removeItem(`tlig${id}`)
    else newList.push(meta.saves[i]);
  }
  meta.saves = newList;

  notifyMessage("I told you so!");
  if (id === meta.save) {
    if (meta.rd.on) {
      meta.save = meta.saves[0]
    } else {
      canSave = false;
      switchSave(meta.saves[0]);
    }
  }

  // what the heck is up with this
  delete meta.data[id]
  saveMeta();
}

function harderMode() {
  const next = parseInt(player.modes.diff) + 1
  if (next == DIFF.length) {
    notifyMessage("You are currently in the maximum difficulty. Hard+ isn't out yet.")
    return
  }
  if (confirm("You are about to try a harder difficulty, which requires more strategy and determination. Proceed to " + DIFF[next] + " Difficulty? THIS FORCES A HARD RESET."))
  reset();
  player.modes.diff = next
  notifyMessage("You are now in " + DIFF[next] + " Difficulty!");
}

function hardReset(force = false) {
  if (
    force || !confirm(
      "Are you absolutely CERTAIN you want to do this? This isn't the soft reset you're looking for. This will reset literally EVERYTHING, with no reward whatsoever."
    )
  ) return;
  reset();
  notifyMessage("Welcome back to the beginning.");
}

function reset() {
  player = new Proxy(setup(), playerHandler);

  tmp.layer = 0;
  updateChalIn();
  setTheme(player.theme);
  stopMusic();
  updateIcons();
  resetTabs();
  canSave = false;
}

// will cause ambugity 
window.onload = load;
window.onbeforeunload = save;

// META
let meta = {
  save: 0,
  saves: [0],
  data: {},
  layer: 0, //highest in all saves

  //REDISCOVERIES
  rd: {},
}

function getSaveId() {
  return `tlig_${meta.rd.on ? "rd" : meta.save || 0}`;
}

function getSaveInfo(data) {
  return `${DIFF[data.diff]}, Layer #${data.layer}<br>Time: ${formatTime(data.time || 0)}`;
}

function saveMeta() {
  localStorage.setItem("tlig_meta", compressSave(meta))
}

function loadMeta() {
  const data = localStorage.getItem("tlig_meta");
  if (data !== null) meta = deepCopy(decompressSave(data), meta);

  if (meta.rd.length !== undefined) meta.rd = {}
  localStorage.setItem("tlig_meta", compressSave(meta));
}

const importFile = document.getElementById('importFile');
function handleFileLoad(event) {
  importSave(event.target.result);
}
importFile.addEventListener('change', (event) => {
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
});