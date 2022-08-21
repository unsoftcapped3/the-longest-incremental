function main(tickLength) {
  if (!inStartGameScreen()) canSave = true;
  if (inStartGameScreen() || inEndGameScreen()) {
    player.lastTick = Date.now();
    updateDOM();
    return;
  }
  updateTmp();

  let diff = tickLength ?? (Date.now() - player.lastTick) / 1000;
  if (!tickLength) {
    if (player.offline.time) {
      diff += player.offline.time / 10;
      player.offline.time *= 0.9;
      if (player.offline.time < 0.1) player.offline.time = null;
    }
    player.lastTick = Date.now();
    if(hasAch(0)||D(player.buyables[0]).gt(0))player.stats.time += diff;
  }

  //META
  meta.layer = Math.max(meta.layer, tmp.layer);
  if (!meta.rd.on) meta.data[meta.save] = {
    layer: tmp.layer,
    diff: player.modes.diff,
    time: player.stats.time,
    name: meta.data[meta.save]?.name ?? "Save",
  };
  if (meta.rd.on && rediscover[player.modes.rd].goal()) finishRediscover();

  //START AT LATTER LAYERS
  let darkDiff = diff;
  if (tmp.layer >= 2) {
    player.dark.time += diff;
    player.dark.maxPoints = Decimal.max(player.dark.maxPoints, player.points);
    if (hasUpg(2, "dark")) {
      // oh pog we have abilities
      // what the heck is this
      player.dark.ab.total = Math.max(
        player.dark.ab.total,
        player.dark.ab.times
      );

      if (player.dark.ab.jump) {
        darkDiff = player.dark.ab.jump.add(darkDiff);
        delete player.dark.ab.jump;
      }
      if (player.dark.ab.cd.tw && player.dark.ab.speed)
        darkDiff = L2_ABILITY.time
          .power()
          .sub(1)
          .mul(Math.min(diff, player.dark.ab.cd.tw))
          .add(darkDiff);
      else delete player.dark.ab.speed;

      if (!tickLength) {
        for (let i in player.dark.ab.cd) {
          player.dark.ab.cd[i] -= diff;
          if (player.dark.ab.cd[i] < 0) delete player.dark.ab.cd[i];
        }
      }
    }
  }

  const idleSpeed = getLayer1Speed(true);
  if (idleSpeed.gt(1)) darkDiff = idleSpeed.mul(darkDiff);

  //Boosters
  if (tmp.layer >= 1) {
    player.boost.time = D(darkDiff).add(player.boost.time);
    player.boost.realTime += diff;
    player.boost.maxPoints = Decimal.max(player.boost.maxPoints, player.points);
    player.boost.consume.eng = D(player.boost.consume.eng).add(
      L1_CONSUME.darkProd().mul(darkDiff)
    );
    player.boost.consume.maxEng = Decimal.max(
      player.boost.consume.maxEng,
      player.boost.consume.eng
    );
  }

  //Main
  player.points = Decimal.plus(
    player.points,
    Decimal.mul(production(), darkDiff)
  );
  player.creatorPower = Decimal.plus(
    player.creatorPower,
    Decimal.mul(buyables[5].prod(), darkDiff)
  );
  player.stats.max = Decimal.max(player.stats.max, player.points);

  updateAutos();
  updateDOM();
  absurdMode();
  updateChallengeCompletions();
}

function updateAutos() {
  if ((L1_MILESTONES.unl(7) || hasUpg(1, "dark")) && player.automationtoggle)
    buyMaxBuyables();
  if ((L1_MILESTONES.unl(12) || hasUpg(1, "dark")) && player.autoUpgrades) {
    for (let i = 0; i <= 6; i++) buyUpg(i, "normal");
  }
  if (hasUpg(6, "dark") && player.autoBooster)
    player.buyables[3] = D(player.buyables[3]).max(getBuyableBulk(3).sub(5));
  if (hasUpg(10, "dark")) {
    if (tmp.auto.booster) {
      Object.entries(player.enhancePriority)
        .sort((a, b) => a[1] - b[1])
        .forEach((i) => {
          while (L1_POLISH.can(i[0])) L1_POLISH.buy(i[0]);
        });
      tmp.auto.booster = false;
    }
    if (tmp.auto.consume) {
      if (Object.keys(player.toningPriority).length) {
        player.boost.consume.upg = {};
        Object.entries(player.toningPriority)
          .sort((a, b) => a[1] - b[1])
          .forEach((i) => {
            L1_CONSUME.tone(1 / 0, i[0]);
          });
      }
      tmp.auto.consume = false;
    }
    //Auto-Consumption
    //Step 0 is handled in 1-booster.js
    if (player.boost.consume.auto.step !== 0 && player.boost.consume.auto.step !== undefined)
      L1_CONSUME_AUTO[player.boost.consume.auto.step]();
  }
}

function setupHTML() {
  // DO NOT USE TMP HERE
  initCredits();
  initModes();
  setupAchDOM();
  setupChaDOM();
  setupUpgradeBuyables();
  tmp.cache.chance.innerHTML = format(chance * 100);
  L1_MILESTONES.setupDOM();
  L1_CONSUME.setupDOM();
  L2_RECALL.setupDOM();
  L2_ALLOY.setupDOM();
  SCALINGS.setupDOM();
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
  const music = [
    "DaBlueTurnip09",
    "CoolRadGamer",
    "meta",
    "incremental_gamer",
    "DeLorean",
  ];

  tmp.cache.credits.writeHTML(`
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
    </table>`);
}

function initModes() {
  tmp.cache.stab_stats_modes.writeHTML(
    "<h2>Mode Descriptions</h2>" +
      "Click and hold to see the mode changes." +
      htmlFor(
        modeTable,
        (value, key) => `<div id="mode_changes_${key}">
          <h3>${key} Changes</h3>
          Balanced up to: ${modeBalanced[key]}<br>
          ${htmlFor(
            value,
            (data, key) => `
              <span class="number">${key + 1}.</span>
              <div class="spoiler" style="width:40%">
                ${data}
              </div>
            `
          )}
        </div>`
      ) +
      "<br>"
  );
}

function updateDOM() {
  const startgame = inStartGameScreen();
  const endgame = inEndGameScreen();
  if (tmp.cache.game_page)
    tmp.cache.game_page.changeStyle(
      "display",
      !endgame && !startgame ? "block" : "none"
    );
  tmp.cache.startgame.changeStyle("display", startgame ? "block" : "none");
  tmp.cache.endgame.changeStyle("display", endgame ? "block" : "none");

  if (!startgame && !endgame) {
    tmp.cache.offline_progress.writeText(
      player.offline.time
        ? "Offline progress: " + format(player.offline.time / 10 + 1) + "x"
        : ""
    );
    tmp.cache.in_chal.writeHTML(
      meta.rd.on
        ? "Get " +
            rediscover[player.modes.rd].goalDesc() +
            " to win! (" +
            formatTime(player.stats.time, 0) +
            ")"
        : tmp.chal.in[0]
        ? "You're currently in Challenge " +
          tmp.chal.in[0] +
          ": " +
          getChal(tmp.chal.in[0]).name +
          "!"
        : ""
    );

    tmp.cache.points.writeText(format(player.points, 2));
    tmp.cache.pointsGain.writeText(format(production().mul(getLayer1Speed())));
    tmp.cache.news_ticker_base.changeStyle(
      "display",
      player.news ? "" : "none"
    );
    tmp.cache.tab_btn_stats.changeStyle(
      "display",
      tmp.layer >= 1 ? "table-row" : "none"
    );
    tmp.cache.tab_btn_dark.changeStyle(
      "display",
      L1_CONSUME.unl() || tmp.layer >= 2 ? "table-row" : "none"
    );
    tmp.cache.tab_btn_chal.changeStyle(
      "display",
      hasUpg(11, "dark") ? "table-row" : "none"
    );

    updateTabsShown();
    if (musicBox) updateMusicBox();
  }
  if (startgame) {
    tmp.cache.diff_0.changeStyle(meta.layer >= 2 ? "" : "none");
  }
  if (endgame) {
    tmp.cache.endwin.writeText([
      "Thanks for playing.",
      "The end.",
      "Good job. You reached the end.",
      "Congratulations! You have reached the end!"
    ][player.modes.diff])
    tmp.cache.endtime.writeText(formatTime(player.stats.time));
    tmp.cache.enddiff.writeText(DIFF[player.modes.diff]);
    tmp.cache.endmessage.changeStyle("display", player.modes.diff == 3 ? "" : "none");
  }
}

function updateTabsShown() {
  switch (TABS.global) {
    case "main":
      updateBuyables();
      tmp.cache.max_all.changeStyle(
        "display",
        tmp.layer >= 1 && !inChal(1) ? "" : "none"
      );
      L1_POLISH.updateDOM();
      L2_ABILITY.updateDOM();

      let cUnl = L1_CONSUME.unl();
      tmp.cache.stabs_main.changeStyle(
        "display",
        tmp.layer >= 1 ? "block" : "none"
      );
      tmp.cache.stab_btn_main_consume.changeStyle(
        "display",
        cUnl ? "" : "none"
      );

      if (TABS.main === "upg") updateUpgrades("normal");
      if (TABS.main === "ms") L1_MILESTONES.updateDOM();
      if (TABS.main === "con") {
        if (!cUnl) switchStab("main", "upg");
        else L1_CONSUME.updateDOM();
      }
      updateAutomation();
      break;
    case "stats":
      updateStats();
      break;
    case "chal":
      updateChaDOM();
      break;
    case "ach":
      updateAchDOM();
      break;
    case "settings":
      updateSettings();
      break;
    case "dark":
      updateLayer2DOM();

      tmp.cache.stabs_dark.changeStyle(
        "display",
        hasUpg(2, "dark") ? "" : "none"
      );
      tmp.cache.stab_btn_dark_alo.changeStyle(
        "display",
        hasUpg(7, "dark") ? "" : "none"
      );

      if (layerUnl(2)) {
        if (TABS.dark === "upg") {
          tmp.cache.dm.writeText(formatWhole(player.dark.res.dm));
          updateUpgrades("dark");
        }
        if (TABS.dark === "rec") {
          if (!L2_RECALL.unl()) switchStab("dark", "upg");
          else L2_RECALL.updateDOM();
        }
        if (TABS.dark === "alloy") {
          if (!L2_ALLOY.unl()) switchStab("dark", "upg");
          else L2_ALLOY.updateDOM();
        }
      }
      break;
  }
}

function updateStats() {
  tmp.cache.max.writeText(format(player.stats.max));
  tmp.cache.time.writeText(formatTime(player.stats.time));
  tmp.cache.layers.writeText(tmp.layer);
  tmp.cache.features.writeText(
    hasUpg(11, "dark")
      ? 6
      : hasUpg(7, "dark")
      ? 5
      : hasUpg(2, "dark")
      ? 4
      : L1_CONSUME.unl() || tmp.layer.unl >= 2
      ? 2
      : tmp.layer.unl >= 1
      ? 1
      : 0
  );

  tmp.cache.stab_btn_stats_l2.changeStyle(
    "display",
    tmp.layer >= 2 ? "" : "none"
  );

  if (TABS.stats == "l1") {
    tmp.cache.booster_time.writeText(
      formatTime(player.boost.time) +
        " (" +
        formatTime(player.boost.realTime) +
        " IRL)"
    );
    tmp.cache.booster_speed.writeText(
      getLayer1Speed().gt(1)
        ? "(" + format(getLayer1Speed()) + "x pre-Darken speed)"
        : ""
    );
    tmp.cache.booster_stat.writeText(format(player.boost.times, 0), 0);
    tmp.cache.booster_restart.writeText(format(player.boost.restart, 0), 0);
    tmp.cache.booster_highest.writeText(format(player.boost.maxPoints));
    tmp.cache.booster_consume.writeText(format(player.boost.consume.amt, 0));
    tmp.cache.booster_enhance.writeText(format(L1_POLISH.totalamt(), 0));
    tmp.cache.booster_highest_eng.writeText(
      format(player.boost.consume.maxEng)
    );
  }
  if (TABS.stats == "l2") {
    tmp.cache.darken_time.writeText(formatTime(player.dark.time));
    tmp.cache.darken_stat.writeText(format(player.dark.times, 0));
    tmp.cache.darken_restart.writeText(format(player.dark.restart, 0));
    tmp.cache.darken_highest.writeText(format(player.dark.maxPoints));
    tmp.cache.darken_ability.writeText(
      format(player.dark.ab.total, 0) +
        " (" +
        format(player.dark.ab.times, 0) +
        " in this Darken)"
    );
    tmp.cache.darken_recall.writeText(format(player.dark.rc.times, 0));
    tmp.cache.darken_res.writeText(Object.keys(player.dark.res).length);
    tmp.cache.darken_max_recall.writeText(
      player.dark.rc.fMax[0] +
        ", " +
        player.dark.rc.fMax[1] +
        ", " +
        player.dark.rc.fMax[2]
    );
    tmp.cache.darken_fuse.writeText(format(player.dark.alloyTimes, 0));
  }
  //if (TABS.stats == "scale") SCALINGS.updateDOM();
  if (TABS.stats == "modes") {
    for (let i in DIFF)
      tmp.cache["mode_changes_" + DIFF[i]].changeStyle(
        "display",
        player.modes.diff == i ? "" : "none"
      );
  }
}

function updateSettings() {
  tmp.cache.load.changeStyle("display", meta.layer >= 1 ? "" : "none");
  tmp.cache.moresaves.changeStyle("display", !meta.rd.on ? "" : "none");
  tmp.cache.reduceDiff.changeStyle(
    "display",
    tmp.layer >= 1 && player.modes.diff > 1 ? "" : "none"
  );
  tmp.cache.offline.writeText(
    `Offline Progress: ${!player.offline.off ? "ON" : "OFF"}`
  );

  tmp.cache.boosterconfirm.changeStyle("display", tmp.layer >= 1 ? "" : "none");
  tmp.cache.boosterconfirm.writeText(
    `Booster Confirm: ${player.boost?.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.respecconfirm.changeStyle(
    "display",
    L1_MILESTONES.unl(1) || tmp.layer > 1 ? "" : "none"
  );
  tmp.cache.respecconfirm.writeText(
    `Respec Confirm: ${player.boost?.respecConfirm ? "ON" : "OFF"}`
  );
  tmp.cache.consumeconfirm.changeStyle(
    "display",
    L1_CONSUME.unl() || tmp.layer > 1 ? "" : "none"
  );
  tmp.cache.consumeconfirm.writeText(
    `Consume Confirm: ${player.boost?.consume?.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.darkconfirm.changeStyle("display", tmp.layer >= 2 ? "" : "none");
  tmp.cache.darkconfirm.writeText(
    `Darken Confirm: ${player.dark?.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.newsbtn.writeText(`News ticker: ${player.news ? "ON" : "OFF"}`);
  tmp.cache.notation.writeText(
    "Notation: " + (player.notation == "mix" ? "Mixed Scientifc" : "Scientific")
  );
  tmp.cache.absurd.writeText(`Absurd Mode: ${player.absurd ? "ON" : "OFF"}`);
}

function updateAutomation() {
  writeAuto(
    player.automationtoggle,
    (L1_MILESTONES.unl(7) || hasUpg(1, "dark")) && !inChal(1),
    "automationtoggle"
  );
  writeAuto(
    player.autoUpgrades,
    L1_MILESTONES.unl(12) || hasUpg(1, "dark"),
    "autoUpgrades"
  );
  writeAuto(player.autoBooster, hasUpg(6, "dark"), "autobooster");
}

function writeAuto(unl, show, comp, text = "(A) Auto") {
  tmp.cache[comp].changeStyle("display", show ? "" : "none");
  tmp.cache[comp].writeText(text + ": " + (unl ? "ON" : "OFF"));
}

function setupRandom() {
  let random = Math.random(); //do not use const because it changes "random" at latter line
  if (random < 0.2) document.title = "Longest Incremental Game";
  if (random < 0.05) {
    document.title = "The Shortest Incremental";
    document.getElementById("favicon").href = imageMap("shortest")
  }
  if (random < 0.01) document.title = "LIGma balls";
  if (random < 0.001) document.title = "Trollcremental 2";
  if (random < 1e-10) {
    document.title = "Your luck skills have broken the multiverse and beyond";
    rickroll();
  }
  if (random < 1e-69) {
    alert("You have reached the funny number. Your number was...");
    alert("You got trololed!");
  }
  if (random < 1e-300) {
    document.title = "Your luck skills have broken the megaverse and beyond";
    rickroll();
  }
  if (random < 0 || random >= 1) {
    alert("What are you doing here????");
    reset();
  }
}

let interval
function loadInterval() {
  interval = setInterval(main, 50);
  const achInterval = setInterval(function() {
    getAchs()
    updateAchDOM()
  }, 1000);
  const saveInterval = setInterval(save, 15000);
  const autoInterval = setInterval(function () {
    if (hasUpg(6, "dark") && player.autoBooster) buyBuyable(3, false, true);
  }, 2000);

  startNews()
}

//DIFFICULTIES
const modeTable = {
  Trivial: [
    "Gain 3x more Points.",
    "Upgrades don't spend Points.",
    "There is only 1 Building Enhancement and it affects all Buildings.",
    "Consumption does not take away effective Boosters.",
    "Dark Toning 2 is changed to: Multiply all Buildings at same rate.",
    "Dark Toning 4 is free, and always at maximum.",
    "Timewarp Power speeds up pre-Darken instead.",
    "All Dark Resources are obtainable with no factors.",
    "All Dark Resource gains are at [0, 0, 0] factors.",
    "There are 2 new milestones for C1 completions",
  ],
  Easy: [
    "Double Maker generation.",
    "There's only 1 Building Enhancement but 2x more expensive.",
    "The 35 Booster milestone still exists.",
    "Timewarp Power is capped at 2x. Above this it will speed up pre-Darken instead.",
    "Consumption reduces effective Boosters linearly. (previously it was quadratic)",
    "All Dark Resource gains are at half of your Recall Factors.",
  ],
  Medium: [
    "Factory Enhances are 20% cheaper.",
    "Booster Enhances are 10% cheaper.",
    "The 35 Booster milestone still exists.",
    "Maximum level for all Tonings are increased by 1.",
    "Timewarp Power is capped at 2x. Above this will speed up pre-Darken instead.",
    "You get 2 Recall Channels at the start of the game. (WIP)",
  ],
  Hard: ["Intended mode. Does not change anything."],
  //"Hard+": ["Coming soon..."]
};
const modeBalanced = {
  Trivial: "Dark World [WIP]",
  Easy: "None! [WIP]",
  Medium: "None! [WIP]",
  Hard: "Endgame",
}
const DIFF = Object.keys(modeTable)

function reduceDiff() {
  if (player.modes.diff === 0) return;
  if (
    !confirm(
      "Warning: This will make this game easier and CAN'T BE REVERTED. If you feel " +
        DIFF[player.modes.diff] +
        " is easy enough, it is not recommended. Are you really sure?"
    )
  )
    return;
  player.modes.diff--;
  notifyMessage("I told you so! The difficulty has been reduced!");

  if (player.modes.diff == 1) {
    player.boost.bu[0] = D(player.boost.bu[0] || 0)
      .max(player.boost.bu[1] || 0)
      .max(player.boost.bu[2] || 0)
      .max(player.boost.bu[3] || 0);

    delete player.boost.bu[1];
    delete player.boost.bu[2];
    delete player.boost.bu[4];
  }
}