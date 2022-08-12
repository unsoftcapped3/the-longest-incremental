function random(list) {
  return list[Math.floor(Math.random()*list.length)]
}

function evalVal(x) {
  return typeof(x) == "function" ? x() : x
}

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
  player.theme = name
  getMusic();
}

function randomTheme() {
  const themes = ["retro","compact","crong","dark","default","dim","honeycake","inverted","light","microwave","superdark","sussy"]
  setTheme(random(themes))
}