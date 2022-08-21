Decimal.prototype.modular = Decimal.prototype.mod = function(other) {
  other = D(other);
  if (other.eq(0)) return D(0);
  if (this.sign * other.sign === -1) return this.abs().mod(other.abs()).neg();
  if (this.sign === -1) return this.abs().mod(other.abs());
  return this.sub(this.div(other).floor().mul(other));
  //extension by MrRedShark77
};

function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function evalVal(x, ...args) {
  return typeof x === "function" ? x(...args) : x;
}

function htmlFor(data, func) {
  let text = "";
  if (Array.isArray(data)) {
    for (const [key, value] of data.entries()) {
      text += func(value, key);
    }
  } else if (typeof data === "object" && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      text += func(value, key);
    }
  }
  return text;
}

function updateBuyThings(key, can, list = ["cannotbuy", "canbuy"]) {
  tmp.cache[key].replaceClass(...(can ? list : list.reverse()));
}

//STYLE OPTIONS
function setTheme(name = "default") {
  tmp.cache.csstheme.changeAttr("href", `themes/${name}.css`);
  tmp.cache.theme.changeAttr("value", name); //doesn't work on selections
  player.theme = name;
  if (name === "compact" || name === "scompact") {
    tmp.cache.favicon.changeAttr("href", imageMap("compactfavicon")); //change here
    changeIcons("compact");
  } else {
    tmp.cache.favicon.changeAttr("href", imageMap("favicon"));
  }
}

function changeTheme() {
  const select = tmp.cache.theme.getAttr("value");
  if (select === "wannacry") {
    if (
      player.wannacry ||
      confirm(
        "THIS IS DANGEROUS, AS IT HAS A RISK OF A HARD RESET. Are you sure?"
      )
    )
      toggleWannacry();
    tmp.cache.theme.changeAttr("value", player.theme);
    return;
  } else {
    setTheme(
      select === "random"
        ? random([
            "retro",
            "compact",
            "scompact",
            "crong",
            "dark",
            "default",
            "dim",
            "inverted",
            "light",
            "microwave",
            "superdark",
            "sussy",
          ])
        : select
    );

    if (!player.music) return;
    const musicId = getThemeMusic();
    if (musicId !== null) changeMusic(musicId);
    if (musicId === null && MUSIC_LIST[music].theme) getMusic();
  }
}

function changeIcons(override) {
  player.icon = override || tmp.cache.icon.getAttr("value");
  updateIcons();
}

function updateIcons() {
  tmp.cache.icon.changeAttr("value", player.icon);
  for (const key of BUYABLE_KEYS) {
    tmp.cache[`buyableImg${key}`].changeAttr(
      "src",
      `${imageMap(
        // TODO: shrink image
        buyables[key].name.toLowerCase() + "_" + player.icon
      )}`
    );
  }
  for (const i of chaList.values()) {
    tmp.cache[`cha${i.id}_img`].changeAttr(
      "src",
      `${imageMap(
        // TODO: shrink image
        "chal" + parseInt(i.id) + "_" + player.icon //idk at this point
      )}`
    );
  }
}

//TABS
const TABS = {};

function switchTab(tab, reset) {
  if (TABS.global === tab) return;
  if (TABS.global) tmp.cache[`tab_${TABS.global}`].hide();
  tmp.cache[`tab_${tab}`].show();

  TABS.global = tab;
  player.tab = tab;
  showHideDark();
  if (!reset) updateTabsShown();
}

function switchStab(x, y, reset) {
  if (TABS[x] === y) return;
  if (TABS[x]) tmp.cache[`stab_${x}_${TABS[x]}`].hide();
  tmp.cache[`stab_${x}_${y}`].show();

  TABS[x] = y;
  player.stab[x] = y;
  if (!reset) updateTabsShown();
}

function resetTabs(hard) {
  switchTab(player.tab || "main", true);
  switchStab("main", player.stab.main || "upg", true);
  switchStab("stats", player.stab.stats || "l1", true);
  switchStab("settings", player.stab.settings || "main", true);
  switchStab("dark", player.stab.dark || "upg", true);
}
