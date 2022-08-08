function compressSave() {
  return LZString.compressToUTF16(JSON.stringify(player));
}

function decompressSave(data) {
  return JSON.parse(LZString.decompressFromUTF16(data));
}

function deepCopy(object, data) {
  if (!data) return;
  // merge data into object
  for (const [key, value] of Object.entries(data)) {
    if (object[key] && object[key].constructor === Object)
      deepCopy(object[key], value);
    else if (object[key] === undefined) object[key] = value;
  }
  return object;
}

async function exportSave() {
  try {
    await navigator.clipboard.writeText(compressSave());
    notifyMessage("Save successfully copied to clipboard.");
  } catch (e) {
    notifyMessage("Your save could not be exported. Sorry!");
    console.error(e);
  }
}
// TODO use textarea to avoid issues with it cutting long strings sometimes
function importSave(save) {
  try {
    save = save || prompt("paste your save here");
    if (!save) return;
    const data = decompressSave(save);
    player = new Proxy(deepCopy(data, setup()), playerHandler);
    //to do: fix undefined bug for player.dark
    resetTabs();
    setTheme(player.theme);
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
    notifyMessage("I told you so!")
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
    setTimeout(function () {
      tmp.cache.dev.changeStyle("opacity", 0);
    }, 2000);
    setTimeout(function () {
      tmp.cache.dev.writeText("");
    }, 5000);
    player.absurd = false;
  } catch (e) {
    canSave = false;
    console.error(e);
  }
}

function loadSave() {
  const save = localStorage.getItem("gaming");
  if (save) importSave(save);
}

function resetTabs() {
  tmp.cache.tab_settings.hide(); //fix bug
  switchTab(player.tab);
  switchStab("main", player.stab.main);
  switchStab("stats", player.stab.stats);
  switchStab("settings", player.stab.settings);
  switchStab("dark", player.stab.dark);
}

function reset() {
  player = new Proxy(setup(), playerHandler);
  save();
  resetTabs();
  setTheme(player.theme);
}

window.onload = load;
window.onbeforeunload = save;

const achInterval = setInterval(getAchs, 1000);
const autoInterval = setInterval(function () {
  if (L1_MILESTONES.unl(10) && player.automationtoggle) {
    buyMaxBuyables();
    if (L1_MILESTONES.unl(40)) for (var i = 0; i <= 6; i++) buyUpg(i, "normal");
  }
}, 2000);
const saveInterval = setInterval(save, 15000);
