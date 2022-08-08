import Decimal from './utils/break_eternity.js'
import {player, production} from './player.js'
import {updateTmp} from './tmp.js'


function main() {
  if (!player) return;
  updateTmp();

  const diff = (Date.now() - player.lastTick) / 1000;
  player.lastTick = Date.now();
  player.stats.time += diff;

  player.points = Decimal.plus(player.points, Decimal.mul(production(), diff));
  player.stats.max = Decimal.max(player.stats.max, player.points);

  player.boost.amt = D(player.buyables[3]);
  if (player.boost.amt.gt(0)) player.boost.unl = true;
  player.boost.time += diff;
  player.boost.maxPoints = Decimal.max(player.boost.maxPoints, player.points);
  player.boost.consume.eng = D(player.boost.consume.eng).add(
    L1_CONSUME.darkProd().mul(diff)
  );

  player.dark.time += diff;

  updateDOM();
  if (player.absurd) {
    let bufhiesibvfib = document.body.querySelectorAll(".tab, #mainContainer");
    let bufhiesibvfib2 = document.body;
    for (const i in bufhiesibvfib) {
      if (bufhiesibvfib[i].style !== undefined) {
        let t = `rotate(${Math.random() * 360}deg) `;
        t += "skew(" + Math.random() * 75 + "deg) ";
        let scale = (Math.random() * 3) ** 2 / 9;
        if (scale < 0.1) scale = 0.1;
        t += "scale(" + scale + ") ";
        bufhiesibvfib[i].style.transform = t;
        bufhiesibvfib2.style.transform = t;
      }
    }
  }
}

function setupHTML() {
  // DO NOT USE TMP HERE
  initCredits();
  setupAchDOM();
  setupUpgradeBuyables();
  document.getElementById("chance").innerHTML = format(chance * 100);
  L1_MILESTONES.setupDOM();
  L1_CONSUME.setupDOM();
}

function initCredits() {
  const devs = [
    "downvoid",
    "DaBlueTurnip09",
    "jakub",
    "IRO",
    "QwQe308",
    "randomtuba",
    "TehAarex",
    "jwklong",
    "TheMkeyHolder",
    "meta",
    "incremental_gamer",
    "yyyy7089",
    "CoolRadGamer",
  ];
  const artists = ["meta", "jwklong", "DeLorean"];
  // DO NOT DO IT IN HERE
  // TMP DOES NOT EXIST
  // huh? see index.html
  // nvm, bruh
  document.getElementById("stab_settings_credits").innerHTML = `
    <h2>Credits</h2>
    <h3>Hoster</h3>
    3^3=7
    <h3>Developers</h3>
    <table id='developers' style='border-collapse: collapse'>
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
    <table id='artists' style='border-collapse: collapse'>
      <tr>
        ${htmlFor(
          artists,
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
  tmp.cache.layers.writeText(player.boost.unl ? 1 : 0);
  tmp.cache.features.writeText(L1_CONSUME.unl() ? 2 : player.boost.unl ? 1 : 0);

  tmp.cache.stab_btn_stats_l2.changeStyle(
    "display",
    player.dark.unl ? "" : "none"
  );
  if (player.stab.stats == "l1") { 
    tmp.cache.booster_time.writeText(format(player.boost.time));
    tmp.cache.booster_stat.writeText(format(player.boost.times));
    tmp.cache.booster_restart.writeText(format(player.boost.restart));
    tmp.cache.booster_highest.writeText(format(player.boost.maxPoints));
  }
  if (player.stab.stats == "l2") { 
    tmp.cache.darken_time.writeText(format(player.dark.time));
    tmp.cache.darken_stat.writeText(format(player.dark.times));
    tmp.cache.darken_restart.writeText(format(player.dark.restart));
  }
}
function updateDOM() {
  if (tmp.cache.points !== undefined) {
    tmp.cache.points.writeText(format(player.points, 2));
    if (tmp.cache.pointsGain !== undefined)
      tmp.cache.pointsGain.writeText(format(production()));

    tmp.cache.tab_btn_auto.changeStyle(
      "display",
      L1_MILESTONES.unl(6) ? "table-row" : "none"
    );
    tmp.cache.tab_btn_ach.changeStyle(
      "display",
      player.boost.unl ? "table-row" : "none"
    );
    tmp.cache.tab_btn_stats.changeStyle(
      "display",
      player.boost.unl ? "table-row" : "none"
    );

    tmp.cache.tab_btn_dark.changeStyle(
      "display",
      L1_CONSUME.unl() || player.dark.unl ? "table-row" : "none"
    );
    switch (player.tab) {
      case "main":
        updateBuyables();
        L1_POLISH.updateDOM();
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
          L1_CONSUME.unl() ? "" : "none"
        );
        if (player.stab.main === "upg") updateUpgrades("normal");
        if (player.stab.main === "ms") L1_MILESTONES.updateDOM();
        if (player.stab.consume === "eng") L1_CONSUME.updateDOM();
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
      case "auto":
        updateAutomation();
        break;
      case "dark":
        updateLayer2DOM()
        break;
    }
  }
}

function updateSettings() {
  tmp.cache["boosterconfirm"].writeText(
    `Booster Confirm: ${player.boost.confirm ? "ON" : "OFF"}`
  );
  tmp.cache.darkenconfirm.changeStyle(
    "display",
    player.dark.unl ? "" : "none"
  );
  tmp.cache["darkenconfirm"].writeText(
    `Darken Confirm: ${player.dark.unl ? "ON" : "OFF"}`
  );
  // oh don't worry we'll have plenty of these buttons in the future
  tmp.cache["absurd"].writeText(`Absurd Mode: ${player.absurd ? "ON" : "OFF"}`);

}

function updateAutomation() {
  tmp.cache["automationtoggle"].writeText(
    "Automation: " + (player.automationtoggle ? "ON" : "OFF")
  );
}

function switchTab(tab) {
  tmp.cache[`tab_${player.tab}`].hide();
  tmp.cache[`tab_${tab}`].show();
  player.tab = tab;
}
function switchStab(x, y) {
  tmp.cache["stab_" + x + "_" + player.stab[x]].hide();
  tmp.cache["stab_" + x + "_" + y].show();
  player.stab[x] = y;
}

function setupRandom() {
  let random = Math.random();
  if (random < 0.1) document.title = "Longest Incremental Game";
  if (random < 0.01) document.title = "LIGma balls";
  if (random < 0.001) document.title = "Trollcremental 2";
  if (random < 1e-30) {
    document.title = "Your luck skills have broken the multiverse and beyond";
    const audio = new Audio(
      "//cdn.glitch.global/3f70934b-8463-45ab-b33e-4045b9696eef/Rick_Astley_-_Never_Gonna_Give_You_Up_legitmuzic.com.mp3?v=1652834040070"
    );
    audio.addEventListener("canplaythrough", () => {
      audio.loop = true;
      const playId = setInterval(async () => {
        try {
          await audio.play();
          clearInterval(playId);
        } catch {
          alert("Never gonna give you up, never gonna let you down! ...");
          alert("Get back to playing the game you fool");
        }
      }, 1);
    });
  }
  if (random < 1e-69) {
    alert("You have reached the funny number. Your number was...");
    alert("You got trololed!");
  }
  if (random <= 0 || random >= 1) {
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
  setTimeout(function () {
    tmp.cache.layerunlock.changeStyle("opacity", 0);
  }, 2000);
  setTimeout(function () {
    tmp.cache.layerunlock.hide();
  }, 4000);
}

const interval = setInterval(main, 50);
