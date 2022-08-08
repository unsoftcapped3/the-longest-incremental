// wannacry stuff

const chance = 0.1
function wannacry() {
  if (Math.random() < chance) {
    alert("oops, you have gotten lucky!");
    alert("Your save will be reverted.");
    reset()
  }
}

function wannacryDOM(name) {
  if (name === "wannacry") {
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

// absurd mode stuff

let absurd = false;

const affectedEls = document.querySelectorAll(".tab, #mainContainer");
function absurdMode() {
  if (!absurd) return;
  for (const el of affectedEls) {
    if (el.style === undefined) return;
    const transform = `rotate(${Math.random() * 360}deg) ` +
    `skew(${Math.random() * 75}deg) ` +
    `scale(${Math.max((Math.random() * 3) ** 2 / 9, 0.1)}) `;
    el.style.transform = transform;
    document.body.style.transform = transform;
  }
}

// rickroll stuff

function rickroll() {
  const audio = new Audio(
    "//cdn.glitch.global/3f70934b-8463-45ab-b33e-4045b9696eef/Rick_Astley_-_Never_Gonna_Give_You_Up_legitmuzic.com.mp3?v=1652834040070"
  );
  audio.addEventListener("canplaythrough", () => {
    audio.loop = true;
    const playId = setInterval(async () => {
      try {
        await audio.play();
        clearInterval(playId);
      } catch {}
    }, 1);
  });
}
