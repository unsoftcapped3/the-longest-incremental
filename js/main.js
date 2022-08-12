function main(tickLength) {
  if (!player) return
  if (inEndGameScreen()) {
    updateDOM();
    return;
  }
  updateTmp()
  const diff = tickLength ? tickLength : (Date.now() - player.lastTick) / 1000;
  if (!tickLength) {
    player.lastTick = Date.now();
    player.stats.time += diff;
  }
  
  //START AT LATTER LAYERS
  let darkDiff = diff
  player.dark.time += diff;
  if (hasUpg(2, "dark")) {
    // oh pog we have abilities
    // what the heck is this
    player.abilities.total = Math.max(player.abilities.total, player.dark.abilitytimes) //fix bug

    if (player.abilities.jump) {
      darkDiff = player.abilities.jump.add(darkDiff)
      delete player.abilities.jump
    }
    if (player.abilities.cd.tw && player.abilities.speed) darkDiff = L2_ABILITY.time.power().sub(1).mul(Math.min(diff, player.abilities.cd.tw)).add(darkDiff)
    else delete player.abilities.speed

    if (!tickLength) {
      for (let i in player.abilities.cd) {
        player.abilities.cd[i] -= diff
        if (player.abilities.cd[i] < 0) delete player.abilities.cd[i]
      }
    }
  }

  let idleSpeed = getLayer1Speed(true)
  if (idleSpeed.gt(1)) darkDiff = idleSpeed.mul(darkDiff)

  //Boosters
  player.boost.amt = D(player.buyables[3]);
  if (player.boost.amt.gt(0)) player.boost.unl = true;
  player.boost.time = D(darkDiff).add(player.boost.time);
  player.boost.realTime += diff;
  player.boost.maxPoints = Decimal.max(player.boost.maxPoints, player.points);
  player.boost.consume.eng = D(player.boost.consume.eng).add(L1_CONSUME.darkProd().mul(darkDiff));
  player.boost.consume.maxEng = Decimal.max(player.boost.consume.maxEng, player.boost.consume.eng);

  //Main
  player.points = Decimal.plus(player.points, Decimal.mul(production(), darkDiff));
  player.creatorPower = Decimal.plus(player.creatorPower, Decimal.mul(buyables[5].prod(), darkDiff));
  player.stats.max = Decimal.max(player.stats.max, player.points);

  updateAutos();
  updateDOM();
  absurdMode();
}

function updateAutos() {
  if ((L1_MILESTONES.unl(6) || hasUpg(1, "dark")) && player.automationtoggle) buyMaxBuyables();
  if ((L1_MILESTONES.unl(10) || hasUpg(1, "dark")) && player.autoUpgrades) {for (let i = 0; i <= 6; i++) buyUpg(i, "normal");}
  if (hasUpg(6, "dark") && player.autoBooster) player.buyables[3] = D(player.buyables[3]).max(getBuyableBulk(3).sub(5))
  if (hasUpg(10, "dark")) {
    if (tmp.temp.boosterAuto) {
      Object.entries(player.enhancePriority)
        .sort((a,b)=>a[1]-b[1])
        .forEach(i=>{
          while (L1_POLISH.can(i[0])) L1_POLISH.buy(i[0])
        })
      tmp.temp.boosterAuto = false
    }
    if (tmp.temp.consumeAuto) {
      player.boost.consume.upg = {}
      Object.entries(player.toningPriority)
        .sort((a,b)=>a[1]-b[1])
        .forEach(i=>{
          while (L1_CONSUME.canTone(i[0])) L1_CONSUME.tone(1, i[0])
        })
      tmp.temp.consumeAuto = false
    }
  }

  //Auto-Consumption
  //Step 0 is handled in 1-booster.js
  if (player.boost.consume.auto.step != 0) L1_CONSUME_AUTO[player.boost.consume.auto.step]()
}

function setupHTML() {
  // DO NOT USE TMP HERE
  initCredits();
  setupAchDOM();
  setupUpgradeBuyables();
  document.getElementById("chance").innerHTML = format(chance * 100);
  L1_MILESTONES.setupDOM();
  L1_CONSUME.setupDOM();
  L2_RECALL.setupDOM();
  L2_ALLOY.setupDOM();
  SCALINGS.setupDOM()
}

function initCredits() {
  const devs = [
    "downvoid",
    "jakub",
    "QwQe308",
    "randomtuba",
    "TehAarex",
    "jwklong",
    "TheMkeyHolder",
    "meta",
    "incremental_gamer",
    "yyyy7089",
    "FlamemasterNXF",
  ];
  const artists = ["meta", "jwklong", "DeLorean", "DaBlueTurnip09"];
  const music = ["DaBlueTurnip09", "CoolRadGamer", "incremental_gamer", "DeLorean"];

  document.getElementById("stab_settings_credits").innerHTML = `
    <h2>Credits</h2>
    <h3>Hoster</h3>
    3^3=7
    <h3>Developers</h3>
    <table style='border-collapse: collapse'>
      <tr> 
        ${htmlFor(
          devs,
          (value, key) => `
          ${key % 4 === 0 ? "</tr><tr>" : ""}
          <td class="credits">${value}</td>
      `
        )}
      </tr>
    </table>
    <h3>Artists</h3>
    <table style='border-collapse: collapse'>
      <tr>
        ${htmlFor(
          artists,
          (value, key) => `
          ${key % 4 === 0 ? "</tr><tr>" : ""}
          <td class="credits">${value}</td>
        `
        )}
      </tr>
    </table>
    <h3>Music</h3>
    <table style='border-collapse: collapse'>
      <tr>
        ${htmlFor(
          music,
          (value, key) => `
          ${key % 4 === 0 ? "</tr><tr>" : ""}
          <td class="credits">${value}</td>
        `
        )}
      </tr>
    </table>`;
}

function updateStats() {
  tmp.cache.max.writeText(format(player.stats.max));
  tmp.cache.time.writeText(format(player.stats.time));
  tmp.cache.layers.writeText(
    player.dark.unl ? 2 : 
    player.boost.unl ? 1 : 0
  );
  tmp.cache.features.writeText(
    //hasUpg(11, "dark") ? 6 :
    hasUpg(7, "dark") ? 5 :
    hasUpg(2, "dark") ? 4 :
    L1_CONSUME.unl() || player.dark.unl ? 2 :
    player.boost.unl ? 1 : 0
  );

  tmp.cache.stab_btn_stats_l2.changeStyle(
    "display",
    player.dark.unl ? "" : "none"
  );

  if (player.stab.stats == "l1") { 
    tmp.cache.booster_time.writeText(
      format(player.boost.time)+"s"+
      " ("+format(player.boost.realTime)+" IRL seconds)"
    );
    tmp.cache.booster_speed.writeText(getLayer1Speed().gt(1)?"("+format(getLayer1Speed())+"x speed)":"")
    tmp.cache.booster_stat.writeText(format(player.boost.times), 0);
    tmp.cache.booster_restart.writeText(format(player.boost.restart), 0);
    tmp.cache.booster_consume.writeText(format(player.boost.consume.amt, 0));
    tmp.cache.booster_enhance.writeText(format(L1_POLISH.totalamt(), 0));
    tmp.cache.booster_highest.writeText(format(player.boost.maxPoints));
    tmp.cache.booster_highest_eng.writeText(format(player.boost.consume.maxEng));
  }
  if (player.stab.stats == "l2") { 
    tmp.cache.darken_time.writeText(format(player.dark.time));
    tmp.cache.darken_stat.writeText(format(player.dark.times, 0));
    tmp.cache.darken_restart.writeText(format(player.dark.restart, 0));
    tmp.cache.darken_ability.writeText(format(player.abilities.total, 0) + " (" + format(player.dark.abilitytimes, 0) + " in this Darken)");
    tmp.cache.darken_recall.writeText(format(player.dark.recall, 0));
    tmp.cache.darken_res.writeText(Object.keys(player.dark.res).length);
    tmp.cache.darken_max_recall.writeText(
      player.dark.recallMax[0]+", "+
      player.dark.recallMax[1]+", "+
      player.dark.recallMax[2]
    );
    tmp.cache.darken_fuse.writeText(format(player.dark.alloyTimes, 0));
  }
  if (player.stab.stats == "scale") SCALINGS.updateDOM()
}
function updateDOM() {
  if (tmp.cache.points !== undefined) {
    const endgame = inEndGameScreen()
    tmp.cache.game_page.changeStyle(
      "display",
      !endgame ? "block" : "none"
    );
    tmp.cache.endgame.changeStyle(
      "display",
      endgame ? "block" : "none"
    );
    if (endgame) return

    tmp.cache.points.writeText(format(player.points, 2));
    tmp.cache.pointsGain.writeText(format(production().mul(getLayer1Speed())));
    tmp.cache.news_ticker_base.changeStyle(
      "display",
      player.news ? "" : "none"
    );
    tmp.cache.tab_btn_stats.changeStyle(
      "display",
      player.boost.unl ? "table-row" : "none"
    );
    tmp.cache.tab_btn_dark.changeStyle(
      "display",
      L1_CONSUME.unl() || player.dark.unl ? "table-row" : "none"
    );
    tmp.cache.tab_btn_chal.changeStyle(
      "display",
      hasUpg(11, "dark") ? "table-row" : "none"
    );

    
    switch (player.tab) {
      case "main":
        updateBuyables();
        L1_POLISH.updateDOM();
        L2_ABILITY.updateDOM();
        tmp.cache.max_all.changeStyle(
          "display",
          player.boost.unl ? "" : "none"
        );
        tmp.cache.stabs_main.changeStyle(
          "display",
          player.boost.unl ? "block" : "none"
        );
        tmp.cache.stab_btn_main_consume.changeStyle(
          "display",
          L1_CONSUME.unl()  ? "" : "none"
        );
  
        if (player.stab.main === "upg") updateUpgrades("normal");
        if (player.stab.main === "ms") L1_MILESTONES.updateDOM();
        if (player.stab.main === "con") {
          if (!L1_CONSUME.unl()) switchStab("main", "upg")
          else L1_CONSUME.updateDOM()
        };
        updateAutomation();
        break;
      case "stats":
        updateStats();
        break;
      case "ach":
        updateAchDOM();
        break;
      case "settings":
        updateSettings();
        break;
      case "dark":
        updateLayer2DOM()
        tmp.cache.stabs_dark.changeStyle(
          "display",
          hasUpg(2, "dark") ? "" : "none"
        );
        tmp.cache.stab_btn_dark_alo.changeStyle(
          "display",
          hasUpg(7, "dark") ? "" : "none"
        );
        if (player.stab.dark === "upg") {
          tmp.cache.dm.writeText(formatWhole(player.dark.res.dm))
          updateUpgrades("dark")
        }
        if (player.stab.dark === "rec") L2_RECALL.updateDOM();
        if (player.stab.dark === "alloy") L2_ALLOY.updateDOM();
        break;
    }
  }
}

function updateSettings() {
  tmp.cache.boosterconfirm.changeStyle(
    "display",
    player.boost.unl ? "" : "none"
  );
  tmp.cache.boosterconfirm.writeText(
    `Booster Confirm: ${player.boost.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.respecconfirm.changeStyle(
    "display",
    L1_MILESTONES.unl(1) || player.dark.unl ? "" : "none"
  );
  tmp.cache.respecconfirm.writeText(
    `Respec Confirm: ${player.boost.respecConfirm ? "ON" : "OFF"}`
  );
  tmp.cache.consumeconfirm.changeStyle(
    "display",
    L1_CONSUME.unl() || player.dark.unl  ? "" : "none"
  );
  tmp.cache.consumeconfirm.writeText(
    `Consume Confirm: ${player.boost.consume.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.darkconfirm.changeStyle(
    "display",
    player.dark.unl ? "" : "none"
  );
  tmp.cache.darkconfirm.writeText(
    `Darken Confirm: ${player.dark.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.newsbtn.writeText(
    `News ticker: ${player.news ? (player.linearNews ? "LINEAR" : "CURVED") : "OFF"}`
  );
  tmp.cache.absurd.writeText(`Absurd Mode: ${player.absurd ? "ON" : "OFF"}`);
  tmp.cache.music.writeText(`${player.music ? "Disable" : "Enable"} music`)
}

function updateAutomation() {
  writeAuto(player.automationtoggle, L1_MILESTONES.unl(6) || hasUpg(1, "dark"), "automationtoggle", "Auto")
  writeAuto(player.autoUpgrades, L1_MILESTONES.unl(10) || hasUpg(1, "dark"), "autoUpgrades")
  writeAuto(player.autoBooster, hasUpg(6, "dark"), "autobooster", "Auto")
}
function writeAuto(unl, show, comp, text="Auto") {
  tmp.cache[comp].changeStyle(
    "display",
    show ? "" : "none"
  );
  tmp.cache[comp].writeText(
    text + ": " + (unl ? "ON" : "OFF")
  );
}
function switchTab(tab) {
  tmp.cache[`tab_${player.tab}`].hide();
  tmp.cache[`tab_${tab}`].show();
  player.tab = tab;
  showHideDark()
  getMusic()
}

function switchStab(x, y) {
  tmp.cache[`stab_${x}_${player.stab[x]}`].hide();
  tmp.cache[`stab_${x}_${y}`].show();
  player.stab[x] = y;
}

function setupRandom() {
  let random = Math.random(); //do not use const because it changes "random" at latter line
  if (random < 0.1) document.title = "Longest Incremental Game";
  if (random < 0.01) document.title = "LIGma balls";
  if (random < 0.001) document.title = "Trollcremental 2";
  if (random < 1e-10) {
    document.title = "Your luck skills have broken the multiverse and beyond";
    rickroll()
  }
  if (random < 1e-69) {
    alert("You have reached the funny number. Your number was...");
    alert("You got trololed!");
  }
  if (random < 1e-300) {
    document.title = "Your luck skills have broken the megaverse and beyond";
    rickroll()
  }
  if (random < 0 || random >= 1) {
    alert("What are you doing here????");
    reset();
  }
  random = Math.random();
  if (random < 0.1)
    document.getElementById("favicon").href =
      "https://the-longest-incremental.themkeyholder.repl.co/images/shortest.png";
}

function notify() {
  tmp.cache.layerunlock.show();
  tmp.cache.layerunlock.changeStyle("opacity", 1);
  tmp.cache.layerbar.writeText(player.dark.unl ? "Layer 2 Unlocked: Darken!" : "Layer 1 Unlocked: Boosters!");
  setTimeout(() => tmp.cache.layerunlock.changeStyle("opacity", 0), 2000);
  setTimeout(() => tmp.cache.layerunlock.hide(), 4000);
}

const interval = setInterval(main, 50);
setInterval(function() {
  if (hasUpg(6, "dark") && player.autoBooster) buyBuyable(3, false, true)
}, 2000)