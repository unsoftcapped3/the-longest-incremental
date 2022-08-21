class Challenge {
  constructor(id, data) {
    this.id = id;
    this.name = data.name;
    this.author = data.author;
    this.desc = data.desc;
    //this.nerf = data.nerf;
    this.layer = data.layer;
    this.resourceName = data.resourceName;
    this.goal = data.goal;
    this.res = data.res;
    //this.img = imageMap(`c${this.id}`);

    //SETUP MILESTONE
    MILESTONES[`c${this.id}`] = {
      // AVOID USING EVAL
      // EVAL IS GARBAGE
      res: _ => chalComps(this.id),
      resName: "Completions",
      data: data.reward
    }
  }
}

const MAX_COMPLETION = 100
const chaList = [
  new Challenge(1, {
    author: "jwklong, TehAarex",
    name: "Anti-Buildings",
    desc: "Buildings and Toning 1 are disabled. You gain +1 base Point/s. Booster cost scaling is reduced.",
    layer: 2,
    goal(x) {
      return D(10).pow((x/2+3)**2); // points
    },
    res() {
      return player.points;
    },
    reward: [
      {
        req: 1,
        eff() {
          return D(2).pow(chalComps(1) ** 0.75)
        },
        desc() { return "C1 completions boost Dark Resources gain (even from Fusing) by " + format(chalEff(1, 0)) + "x."},
      },
      {
        req: 2,
        desc: "Unlock new Dark Resources.",
      },
      {
        req: 4,
        desc: "At 5 Recall Factor, all Dark Resources are gettable up to [1,1,1].",
      },
      {
        req: 100,
        unl: _ => player.modes.diff == 1,
        desc: "At 5 Recall Factor, all Dark Resources are gettable up to [2,2,2].",
      }
    ]
  }),
  new Challenge(2, {
    author: "downvoid",
    name: "Light Energy",
    desc: "Dark Tonings scale 50% faster and you cannot gain extra Tonings. Toning 3 is disabled.",
    layer: 2,
    goal(x) { return D(10).add(x * 1.5).floor()}, // tonings
    resourceName: "tonings",
    res() {
      return L1_CONSUME.toneBulk()
    },
    reward: [
      {
        req: 1,
        eff: _ => player.ach.length*0.1+1,
        desc: _ => "Each achievement boosts Dark Energy by +10% (additive). Currently: " + format(chalEff(2,0)) + "x.",
      },
      {
        req: 2,
        eff: _ => Math.max(chalComps(2) * 3, 0),
        desc: _ => "Gives " + format(chalEff(2, 1), 0) + " free boosters for  enhancing.",
      },
      {
        req: 4,
        eff: _ => Math.max(Math.sqrt(chalComps(2) / 3), 1),
        desc: _ => "Cheapen Enhancements by /" + format(chalEff(2, 2)) + ".",
      },
      {
        req: 6,
        eff: _ => Math.log10(Math.max(chalComps(2) - 4, 1)) + 1,
        desc: _ => "Dark Condenser 3: Boost Dark Toning 3 but reduce their cap by " + format(chalEff(2, 3)) + "x.",
      },
      {
        req: 8,
        eff: _ => Math.log10(Math.max(chalComps(2) - 6, 1)) + 1,
        desc: _ => "Dark Condenser 2: Boost Dark Toning 2 but reduce their cap by " + format(chalEff(2, 4)) + "x.",
      },
      {
        req: 10,
        eff: _ => Math.log10(Math.max(chalComps(2) - 8, 1)) + 1,
        desc: _ => "Dark Condenser 5: Boost Dark Toning 5 but reduce their cap by " + format(chalEff(2, 5)) + "x.",
      },
    ]
  }),
  new Challenge(3, {
    author: "meta",
    name: "Deboosted",
    desc: "Boosters are weaker. Toning 2 is disabled.",
    layer: 2,
    goal(x) { return D(10).pow(x * 9 + x * x + 50);}, // points
    res() {
      return player.points;
    },
    reward: [
      {
        req: 1,
        desc: "Start with first 5 booster milestones.",
      },
      {
        unl: _ => player.modes.diff >= 3,
        req: 2,
        desc: "Dark Toning 4 is always at maximum.",
      },
      {
        req: 3,
        desc: "Outside of Darken Challenges, Resizer maximum is always at max points over Darken runs.",
      },
      {
        req: 10,
        desc: "Outside of Darken Challenges, Boosters reset nothing.",
      },
      {
        req: 20,
        desc: "Always have Creator unlocked.",
      },
    ]
  }),
  new Challenge(4, {
    author: "downvoid",
    name: "Hyperscaling",
    desc: "Buildings, Boosters, and Enhancements' scalings are greatly increased. Toning 4 is disabled.",
    layer: 2,
    goal(x) { return D(5).add(x ** (4/3)).round()}, // boosters
    resourceName: "boosters",
    res() {
      return getBoosters();
    },
    reward: [
      {
        req: 1,
        desc: "Multiply Recall Base by 1.25x.",
      },
      {
        req: 2,
        desc: "Gain 2x more Dark Resources, even from Fusing.",
      },
    ]
  }),
  new Challenge(5, {
    author: "DeLorean",
    name: "Insufficient Power",
    desc: "Points are reduced to ^0.75 and Dark Energy is reduced to ^0.55.",
    layer: 2,
    goal(x) { return D(10).pow(x * x + x * 4 + 40);}, // points , should go up by e10 or e7 points each completation
    res() {
      return player.points;
    },
    reward: [
      {
        req: 1,
        eff: _ => D(3).pow(chalComps(5) ** 0.75),
        desc: _ => "Multiply Coolant and Heatant by " + format(chalEff(5, 0)) + "x.",
      },
    ]
  }),
  new Challenge(6, {
    author: "Everyone!",
    name: "Zenith",
    desc: "Challenges 2, 3, and 5 are all applied.",
    layer: 2,
    goal(x) { return D((5 + x) * (player.modes.diff < 2 ? 2 : 5));}, // enhances
    // I balanced all the challenges except this one, right now I can't even reach 1 booster in this
    // after we add the rewards for other challenges I will balance this challenge
    res() {
      return L1_POLISH.totalamt()
    },
    resourceName: "enhances",
    reward: [
      {
        req: 1,
        desc: "Unlock Elemental. [SOON]",
      },
      {
        req: 2,
        unl: _ => layer_placeholder(3),
        desc: "Unlock Elemental Essences.",
      },
    ]
  }),
];

//GET
function getChal(id) {
  return chaList.find(i=>i.id===id)
}

function getChalLayerPlayer(layer) {
  return getLayerPlayer(layer)?.chal ?? {}
}

function getChalPlayer(id) {
  return getChalLayerPlayer(getChal(id).layer)
}

function setChal(id) {
  if (id === chosen) {
    startChal()
    return
  }

  const chal = getChal(id)
  tmp.cache.chadescdiv.show()
  tmp.cache.chatitle.writeHTML("[" + id+ "] " + chal.name)
  tmp.cache.chaauthor.writeHTML("By: " + chal.author)
  tmp.cache.chadesc.writeHTML(chal.desc)
  tmp.cache.chagoal.writeHTML(formatWhole(chal.goal(chalComps(id))) + (chal.resourceName ? " " + chal.resourceName : " points"))
  MILESTONES_CORE.setup("charewards", "c"+id)

  if (chosen !== undefined) updateBuyThings(`cha${chosen}`, false)
  updateBuyThings(`cha${chal.id}`, true)
  chosen = id

  updateChaDOM()
}

function inChal(id) {
  return tmp.chal.force.includes(id)
}

let chosen;
function toggleCha() {
  (!chosen || getChalPlayer(chosen).in === chosen) ? exitChal() : startChal();
}

function startChal(selected) {
  const toStart = selected ?? chosen
  const layer = getChal(toStart).layer
  const p = getChalLayerPlayer(layer)

  p.in = toStart
  getLayerPlayer(layer).chal = p
  doLayerReset(layer, true)

  if (layer === 2) updateChalIn()
}

function exitChal() {
  delete getChalLayerPlayer(tmp.chal.layer[0]).in
  updateChalIn()
}

//COMPLETIONS
function updateChallengeCompletions(){
  const layer = tmp.chal.layer[0]
  if (!layer) return

  const inC = getChalLayerPlayer(layer).in
  const chal = getChal(inC)
  const amount = chal.res()
  if (D(amount).gte(chal.goal(chalComps(inC))) && chalComps(inC) < MAX_COMPLETION) {
    getChalLayerPlayer(layer)[inC] = chalComps(inC) + 1
  }
}

function chalComps(id) {
  return getChalPlayer(id)[id] ?? 0
}

function hasChaReward(id, num) {
  return MILESTONES_CORE.got("c"+id, num)
}

function chalEff(id, num) {
  return MILESTONES["c"+id].data[num].eff()
}

//STORAGE
function updateChalIn() {
  let list = []
  let layers = []
  // what
  // stores challenges you are in from multiple layers
  for (let i = 2; i <= 2; i++) {
    let p = getChalLayerPlayer(i).in
    if (p) {
      list.push(p)
      layers.push(i)
    }
  }
  tmp.chal = {
    // DOES NOT WORK
    in: list,
    force: list,
    layer: layers
  }

  if (tmp.chal.in.includes(6)) tmp.chal.force = tmp.chal.force.concat([2, 3, 5])
}

//DOM
function setupChaDOM() {
 tmp.cache.chas.writeHTML(
  "<tr>" + htmlFor(chaList, (value, key) => `
    ${key%3 === 0 ? '</tr><tr>' : ''}
    <td onclick="setChal(${value.id})">
      <div
        id="cha${value.id}"
        class="cannotbuy"
        style="width:51px; height:43px"
      >
        <img 
          src="${imageMap("chal"+value.id)}" 
          style="width:43px; height:43px"
          id="cha${value.id}_img"/>
          
      </div>
      <span id="comps${value.id}"></span>/${MAX_COMPLETION}
    </td>
  `) + "</tr>")
}

function updateChaDOM() {
  tmp.cache.chaexit.changeStyle(
    "display",
    (chosen || tmp.chal.in[0]) ? "" : "none"
  )
  tmp.cache.chaexit.setClasses(
    (!chosen || getChalPlayer(chosen).in === chosen) ? 
    `` :
    `prestige` + getChal(chosen).layer
  );
  tmp.cache.chaexit.writeHTML(
    (!chosen || getChalPlayer(chosen).in === chosen) ? 
    `Exit Challenge` :
    `Start Challenge`
  );
  for (const chal of chaList.values()){
    tmp.cache[`comps${chal.id}`].writeHTML(chalComps(chal.id));
  }
  MILESTONES_CORE.update("charewards")
}