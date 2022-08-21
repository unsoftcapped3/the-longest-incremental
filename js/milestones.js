const MILESTONES_CORE = {
  setup(view, type) {
    const data = MILESTONES[type];
    let viewed = true;
    this.view[view] = type;
    tmp.cache[view].addClasses("milestones");
    tmp.cache[view].writeHTML(
      data
        ? htmlFor(data.data, (value, key) => {
           return `<tr id="${view}Disp${key}" style='display: none'>
              <td id="${view}Req${key}" style='text-align: left; width: 240px; border: 2px solid #0000003f' class="cannotbuy"><b>${formatWhole(value.req)} ${data.resName}</b>:</td>
              <td id="${view}Desc${key}">${typeof value.desc == "function" ? "Loading..." : value.desc}</td>
            </tr>`
          })
        : "<tr><td>ERROR: NO MILESTONES FOUND</td></tr>"
    );
  },
  update(view) {
    const type = this.view[view];
    if (!type) return;

    const data = MILESTONES[type];
    if (!data) return;

    let viewed = true;
    for (const [m, v] of Object.entries(data.data)) {
      const unl = this.unl(type, m) && viewed;
      tmp.cache[view + "Disp" + m].changeStyle(
        "display",
        unl ? "table-row" : "none"
      );
      if (!unl) continue;

      const got = this.got(type, m);
      tmp.cache[view + "Req" + m].setClasses(
        this.got(type, m) ? "bought" : "cannotbuy"
      );
      if (typeof v.desc === "function")
        tmp.cache[view + "Desc" + m].writeHTML(v.desc());
      if (!got) viewed = false;
    }
  },

  view: {},
  unl(type, id) {
    return evalVal(MILESTONES[type].data[id].unl) ?? true;
  },
  got(type, id) {
    if (!this.unl(type, id)) return;

    let data = MILESTONES[type];
    let res = data.res();
    return res.m ? res.gte(data.data[id].req) : res >= data.data[id].req;
  },
};

const MILESTONES = {};
