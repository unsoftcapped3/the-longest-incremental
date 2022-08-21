// wannacry stuff
const chance = 0.1
function wannacry() {
  if (Math.random() < chance) {
    alert("oops, you have gotten lucky!");
    alert("Your save will be reverted.");
    reset()
  }
}

function wannacryDOM() {
  if (player.wannacry) {
    canSave = false;
    [...document.getElementsByTagName("button")].forEach((i) =>
      i.addEventListener("click", wannacry)
    );
    tmp.cache.wannacry.show();
  } else {
    canSave = true;
    [...document.getElementsByTagName("button")].forEach((i) =>
      i.removeEventListener("click", wannacry)
    );
    tmp.cache.wannacry.hide();
  }
}
function toggleWannacry() {
  player.wannacry = !player.wannacry
  wannacryDOM()
  rickroll()
}

// absurd mode stuff
let absurd = false;
const affectedEls = document.querySelectorAll(".tab, #mainContainer");
function absurdMode() {
  for (const el of affectedEls) {
    if (el.style === undefined) return;
    const transform = absurd ? `rotate(${Math.random() * 360}deg) ` +
    `skew(${Math.random() * 75}deg) ` +
    `scale(${Math.max((Math.random() * 3) ** 2 / 9, 0.1)}) ` : ``;
    el.style.transform = transform;
    document.body.style.transform = transform;
  }
}