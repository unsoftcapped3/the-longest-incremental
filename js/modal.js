// When the user clicks on <span> (x), close the modal
let hasSetup = false;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
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
          buyableOrder.filter(i => i !== 5),
          (key) => {
          const val = buyables[key];
          const name = val.name;
          return `
          <div>
            ${name}: Priority 
            <select id="selectEnhance${key}">
              <option value="">Disable</option>
              ${htmlFor(
                Array(buyableOrder.length - 1)
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
      <button onclick="L1_POLISH.updateEnhanceAuto()">Update Selection</button><button onclick="tmp.temp.boosterAuto=true">Force rerun</button>
    `,
    onShow() {
      for (const key of BUYABLE_KEYS) {
        const val = player.enhancePriority[key]
        if (val === undefined) continue
        document.getElementById(`selectEnhance${key}`).value = val.toString()
      }
    }
  },
  toning: {
    html: () => `
      <h3>Consumption Automation</h3>
      <div>
        This automatically consumes with abilities being used.<br>
        This only triggers upon a booster reset and getting at least 1 more consumption than before.<br><br>
        <input id="autoConsumeToggle" type="checkbox" ${player.boost.consume.auto.on?"checked":""}>
      </div>
      <br>
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
          (value, key) => `
          <div>
            Toning ${(Number(key)+1).toString()}: Priority 
            <select id="selectTone${key}">
              <option value="">Disable</option>
              ${htmlFor(
                Array(Object.keys(L1_CONSUME.toneData).length)
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
      <button onclick="L1_CONSUME.updateAuto()">Update Selection</button><button onclick="tmp.temp.consumeAuto=true">Force rerun</button>
    `,
    onShow() {
      for (const key of Object.keys(L1_CONSUME.toneData)) {
        const val = player.toningPriority[key]
        if (val === undefined) continue
        document.getElementById(`selectTone${key}`).value = val.toString()
      }
    }
  },
  update: {
    html: () => `
    <h3 style="font-size: 24px">Update ${verName(ver)}!</h3><br>
    We finished off Darken layer with 3 new features.<br>
    Preparation for recall and abilities!<br>
    Hope you enjoy this update!
  `,
  },
};
function openModal(name) {
  tmp.cache.myModal.show();
  tmp.cache.contentInsert.writeHTML(evalVal(MODALS[name].html));
  MODALS[name].onShow?.()
  if (!hasSetup) {
    tmp.cache.close.el.onclick = function () {
      closeModal();
    };
    hasSetup = true;
  }
}
function closeModal() {
  tmp.cache.myModal.hide();
}
