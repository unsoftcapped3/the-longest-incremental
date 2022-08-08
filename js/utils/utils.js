const D = (x) => new Decimal(x);

function htmlFor(data, func) {
  let text = "";
  if (Array.isArray(data)) {
    for (const [key, value] of data.entries()) {
      text += func(value, key)
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      text += func(value, key)
    }
  }
  return text
}

function updateBuyThings(key, can, list = ["cannotbuy", "canbuy"]) {
  tmp.cache[key].replaceClass(
    ...(
      can ? list : list.reverse()
    )
  )
}

function setTheme(name = "default") {
  document.getElementById("csstheme").href = "themes/"+name+".css"
 if (name === 'wannacry') {
    [...document.getElementsByTagName("button")].forEach(i => i.addEventListener('click', wannacry))
   tmp.cache.wannacry.show()
  } else {
    [...document.getElementsByTagName("button")].forEach(i => i.removeEventListener('click', wannacry))
   tmp.cache.wannacry.hide()
  }
  player.theme = name
}

function randomTheme() {
  const themes = ["retro","compact","crong","dark","default","dim","honeycake","inverted","light","microwave","superdark","sussy"]
  setTheme(themes[Math.floor(Math.random()*themes.length+1)])
}