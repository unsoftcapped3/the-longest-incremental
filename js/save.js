function compressSave() {
  return LZString.compressToUTF16(JSON.stringify(player));
}

function decompressSave(data) {
  return JSON.parse(LZString.decompressFromUTF16(data));
}

function deepCopy(object, data) {
  if (!data) return;
  // merge data into object
  for (const key in data) {
    if (object[key] && object[key].constructor === Object)
      deepCopy(object[key], data[key]);
    else if (object[key] === undefined) object[key] = data[key];
    //stop. my method works with if (object[key] === undefined)
    //please, it only assigns missing things.
    // f i n e
    //you need to handle both cases
    //and assign it too
  }
  return object;
}

async function exportSave() {
  try {
    if (!canSave) throw "Nice try."
    await navigator.clipboard.writeText(compressSave())
    notifyMessage("Save successfully copied to clipboard.");
  } catch (e) {
    notifyMessage("Your save could not be exported due to an error. Sorry!");
    console.error(e);
  }
}

async function downloadSave() {
  try {
    if (!canSave) throw "Nice try."

    const file = new Blob([compressSave()], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "The Longest Incremental - " + new Date().toGMTString()+".txt"
    a.click()
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
    const data = decompressSave(save);
    // WHY THIS WON"T WORK
    // setup will overide data
    // meaning that you won't have a imported save
    // this overwrites the save for deepCopy(setup(), data).
    // that mean data gets overwritten, not setup()
    
    player = new Proxy(deepCopy(data, setup()), playerHandler);
    resetTabs();
    setTheme(player.theme);

    if (ver > player.ver) {
      player.ver = ver
      player.hasWon = false
    }
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
    setTimeout(() => {
      tmp.cache.dev.changeStyle("opacity", 0);
    }, 2000);
    
    setTimeout(() => {
      tmp.cache.dev.writeText("");
    }, 5000)
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
  //switchStab("dark", player.stab.dark);
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

const saveInterval = setInterval(save, 15000);
