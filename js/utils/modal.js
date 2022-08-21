// When the user clicks on <span> (x), close the modal
let hasSetup = false;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === tmp.cache.myModal.el) {
    closeModal();
  }
};

const MODALS = {
  boost: {
    html: () => `
      <h3>Enhance Automation</h3>
      <div>
        Note: lower priorities go first before higher ones.<br>
        That means that a priority of 3 will trigger before a priority of 5.<br>
        This only triggers upon a booster reset unless you click "Force rerun".
      </div>
      <br>
      <div>
        ${htmlFor(
          buyableOrder,
          (key) => {
          const val = buyables[key];
          const name = val.name;
          if (!L1_POLISH.unl(key)) return ``
          return `
          <div>
            ${key == 0 && player.modes.diff <= 1 ? "Buildings" : name}: Priority 
            <select id="selectEnhance${key}" 
                    onchange="L1_POLISH.updateEnhanceAuto()">
              <option value="">Disable</option>
              ${htmlFor(
                Array(5)
                  .fill()
                  .map((_, i) => i + 1),
                (id) => `
                  <option value="${id}">${id}</option>
                `
              )}
            </select>
          </div>
          `;
          }
        )}
      </div>
      <button onclick="tmp.auto.booster=true">Force rerun</button>
    `,
    onShow() {
      for (const key of BUYABLE_KEYS) {
        const val = player.enhancePriority[key]
        if (val === undefined) continue
        if (tmp.cache[`selectEnhance${key}`] !== undefined) tmp.cache[`selectEnhance${key}`].changeAttr("value", val.toString())
      }
    }
  },
  toning: {
    html: () => `
      ${
        player.modes.diff == 0 ? "" :
        `<h3>Consume Automation</h3>
        <div>
          This automatically consumes with abilities being used.<br>
          This only triggers upon a booster reset and getting at least 1 more consumption than before.<br><br>
          <input id="autoConsumeToggle" type="checkbox" ${player.boost.consume.auto.on?"checked":""} onchange="L1_CONSUME.updateAuto()">
        </div><br>`
      }
      <h3>Toning Automation</h3>
      <div>
        Note: lower priorities go first before higher ones.<br>
        That means that a priority of 3 will trigger before a priority of 5.<br>
        This only triggers upon a consume or release unless you click "Force rerun".
      </div>
      <br>
      <div>
        ${htmlFor(
          L1_CONSUME.toneData,
          (value, key) => !value.unl() ? `` : `
          <div>
            Toning ${(Number(key)+1).toString()}: Priority 
            <select id="selectTone${key}"
                    onchange="L1_CONSUME.updateAuto()">
              <option value="">Disable</option>
              ${htmlFor(
                Array(5)
                  .fill()
                  .map((_, i) => i + 1),
                (id) => `
                  <option value="${id}">${id}</option>
                `
              )}
            </select>
          </div>
          `
        )}
      </div>
      <button onclick="tmp.auto.consume=true">Force rerun</button>
    `,
    onShow() {
      for (const key in L1_CONSUME.toneData) {
        const val = player.toningPriority[key];
        if (val === undefined) continue;
        if (tmp.cache[`selectTone${key}`] !== undefined) tmp.cache[`selectTone${key}`].changeAttr("value", val.toString());
      }
    }
  },
  load: {
    html: () => `
      <div>You can view mode changes in Stats -> Modes</div>
      <button onclick="newSave(tmp.cache.difficulty.getAttr('value') == -1 ? {} : { diff: tmp.cache.difficulty.getAttr('value') }); closeModal()">New save</button>
      ${meta.layer>1?`<button onclick="openModal('rediscover')">Rediscover</button>`:``}
      Difficulty: 
      <select id='difficulty'>
        ${htmlFor(DIFF,
          (value, key) => key == 0 && meta.layer < 2 ? `` : `<option value=${key}>${value}</option>`
        )}
      </select>      
      <br>
      <table>
        ${htmlFor(
          meta.saves,
          (v, key) => {
            const data = meta.data[v]
            // TODO: use modal to make custom prompt
            return `<tr style='vertical-align: 0'>
              <td><b>${ (data && data.name) || ("Save #" + key) }</b>:${ meta.save == v && !meta.rd.on ? "<br>(Playing)" : "" }</td>
              <td>${data ? getSaveInfo(data) : "?"}</td>
              <td><button onclick="switchSave(${v}); closeModal()">Load</button>
              <button onclick="meta.data[${v}].name = prompt(); saveMeta(); openModal('load')">Rename</button>
              ${meta.saves.length > 1 ? `<button onclick="deleteSave(${v}); openModal('load')">Delete</button></td>` : ``}
            </tr>`
          })}
      </table>
    `
  },
  rediscover: {
    html: () => `
      <button onclick="openModal('load')">Back</button>
      Difficulty:
      <select id='difficulty' onchange="MODALS.rediscover.onShow()">
        ${htmlFor(DIFF,
          (value, key) => key == 0 && meta.layer < 2 ? `` : `<option value=${key}>${value}</option>`
        )}
      </select>  
      <h2>Rediscover the features...</h2>
      ${meta.rd.has?`
        <button onclick='continueRediscover()'>Continue</button><br>
        <b style='color: red'>You have a Rediscovery! Starting will overwrite it.</b><br>
      `:``}
      Select a savepoint to start a speedrun.<br>
      ${htmlFor(rediscover,
        (v, key) =>
        v.unl() ? `<button onclick="startRediscover('${key}')" class="u prestige${v.layer}"><h2>Layer ${v.layer}</h2>${v.name}<br><span id="rd_${key}"></span></button>` : ``
      )}
    `,
    onShow() {
      let diff = tmp.cache.difficulty.getAttr("value")
      for (const i in rediscover) {
        tmp.cache["rd_"+i].writeText(
          meta.rd[i+"_"+diff] ? "Best: " + formatTime(meta.rd[i+"_"+diff].time, 0) :
          "")
      }
    }
  },
  update: {
    html: () => `
    <h3 style="font-size: 24px" style="font-family: Courier; color: red; text-shadow: 0 0 6px red">Update ${verName(ver)}!</h3><br>
    We finally implemented 7 new Challenges!<br>
    And, easier modes have been added for a relief!<br><br>
    I hope you are ready for a new layer.<br>
    Hope you enjoy this update!
  `,
  },
};

function openModal(name) {
  tmp.cache.myModal.show();
  tmp.cache.contentInsert.writeHTML(evalVal(MODALS[name].html));
  MODALS[name].onShow?.();
  if (!hasSetup) {
    tmp.cache.close.el.onclick = closeModal; //lmao you can just
    hasSetup = true;
  }
}

function closeModal() {
  tmp.cache.myModal.hide();
  tmp.cache.contentInsert.writeHTML("")
}
