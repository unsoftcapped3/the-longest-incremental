const ver = {
  release: 0,
  layers: 2,
  content: 0,
  patch: 0,
  beta: false
};

function compressSave() {
  return LZString.compressToBase64(JSON.stringify(player));
}

function decompressSave_old(data) {
  return JSON.parse(LZString.decompressFromUTF16(data));
}

function decompressSave(data) {
  return JSON.parse(LZString.decompressFromBase64(data));
}

function getVer(x) {
  if (typeof x === "number") {
    x = {
      release: 0,
      layers: Math.round(x * 10),
      content: 0,
      patch: 0,
      beta: false,
    };
  }
  return x;
}

function gtVer(x, y) {
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
    else if (object[key] === undefined) object[key] = data[key];
  }
  return object;
}

async function exportSave() {
  try {
    if (!canSave) throw "Nice try.";
    await navigator.clipboard.writeText(compressSave());
    notifyMessage("Save successfully copied to clipboard.");
  } catch (e) {
    notifyMessage("Your save could not be exported due to an error. Sorry!");
    console.error(e);
  }
}

async function downloadSave() {
  try {
    if (!canSave) throw "Nice try.";
    const file = new Blob([compressSave()], { type: "text/plain" });
    window.URL = window.URL || window.webkitURL;
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(file);
    a.download =
      "The Longest Incremental - " + new Date().toGMTString() + ".txt";
    a.click();
    notifyMessage("Save successfully downloaded.");
  } catch (e) {
    notifyMessage("Your save could not be exported due to an error. Sorry!");
    console.error(e);
  }
}
// TODO use textarea to avoid issues with it cutting long strings sometimes
function importSave(save) {
  try {
    save = save || prompt("paste your save here");
    if (!save) return;
    const data = decompressSave_old(save) ?? decompressSave(save);
    player = new Proxy(deepCopy(data, setup()), playerHandler);
    resetTabs();
    setTheme(player.theme);

    document.getElementById("alloyPercentage").setAttribute("value", player.dark.alloyPercentage)
    if (gtVer(ver, player.ver)) {
      player.hasWon = false;
      notifyMessage("The game has been successfully updated!");
      openModal("update");
      //hide until release
    }
    player.ver = ver;
  } catch (error) {
    alert("Invalid save!");
    console.error(error);
  }
}

function hardReset() {
  if (
    confirm(
      "Are you absolutely CERTAIN you want to do this? This isn't the soft reset you're looking for. This will reset literally EVERYTHING, with no reward whatsoever."
    )
  )
    reset();
  notifyMessage("I told you so!");
}

let canSave = false;
function save(manual) {
  if (!canSave) return;
  localStorage.setItem("gaming", compressSave());
  if (manual) notifyMessage("Game saved");
}

function load() {
  try {
    setupHTML(); //load first
    setupTmp();
    setupRandom();
    loadSave();
    canSave = true;

    tmp.cache.loading_page.hide();
    tmp.cache.game_page.show();
    tmp.cache.ver.writeText(verName(ver));
  } catch (e) {
    canSave = false;
    console.error(e);
  }
}

function loadSave() {
  const save = localStorage.getItem("gaming");
  if (save) importSave(save);
}

function resetTabs(hard) {
  if (hard) {
    switchTab("main");
    switchStab("main", "upg");
    switchStab("stats", "l1");
    switchStab("settings", "main");
    switchStab("dark", "upg");
  } else {
    switchTab(player.tab);
    switchStab("main", player.stab.main);
    switchStab("stats", player.stab.stats);
    switchStab("settings", player.stab.settings);
    switchStab("dark", player.stab.dark);
  }
}

function reset() {
  let data = setup();
  resetTabs(true);
  player = new Proxy(data, playerHandler);
  save();
  setTheme(player.theme);
}

window.onload = load;
window.onbeforeunload = save;

const achInterval = setInterval(getAchs, 1000);
const saveInterval = setInterval(save, 15000);
