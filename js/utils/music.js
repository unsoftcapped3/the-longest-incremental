let music = ""
function changeMusic(name) {
  if (name == music) return
  music = name
  audioMap.forEach(i=>i.pause())
  if (music === "crong") {
    crong()
    notifyMessage("Playing: [unnamed] - CRG")
  } else if (music === "compact") {
    compact()
    notifyMessage("Playing: Compact Theme A - DeLorean")
  } else if (music === "gwa") {
    gwa()
    notifyMessage("Playing: [unnamed] - [unknown author]")
  } else if (music === 'rickroll') {
    rickroll()
    notifyMessage("Playing: rickroll - Rick Astley (added by incremental_gamer)")
  } else if (music === "music0") {
    playMusic0()
    notifyMessage("Playing: Sunrise - DaBlueTurnip09")
  } else if (music === "music1") {
    playMusic1()
    notifyMessage("Playing: On Beat - DaBlueTurnip09")
  } else if (music === "music2") {
    playMusic2()
    notifyMessage("Playing: It Consumes All - DaBlueTurnip09")
  }
}

function getMusic() {
  if (player.music) {
    if (player.wannacry) changeMusic("rickroll")
    else if (player.theme === "compact" || player.theme === "scompact") changeMusic("compact")
    else if (player.theme === "crong") changeMusic("crong")
    else if (player.theme === "inverted" || player.theme == "superdark" || player.theme == "light") changeMusic("gwa")
    else if (player.dark.unl||player.tab === "dark") changeMusic("music2")
    else if (player.boost.unl) changeMusic("music1")
    else changeMusic("music0")
    audioMap.get(audioMap.keys().next().value).volume=0.25
  } else {
    changeMusic("")
  }
  
}

// rickroll stuff
const audioMap = new Map()
function rickroll() {
  audioMap.set("rickroll", playAudio("//cdn.glitch.global/3f70934b-8463-45ab-b33e-4045b9696eef/Rick_Astley_-_Never_Gonna_Give_You_Up_legitmuzic.com.mp3?v=1652834040070"))
}
function crong(){
  audioMap.set("crong", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/AAAAAAAAAAAAAAAAAA.mp3?v=1659992407502"))
}
function gwa() {
  audioMap.set("gwa", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/4831701109047296.wav?v=1660060854784"))
}
function compact() {
  audioMap.set("compact", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/compact_theme.mp3?v=1660173495714"))
}
function playMusic0() {
  audioMap.set("music0", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/The_Longest_Incremental_-_Sunrise.mp3?v=1660072194132"))
}
function playMusic1() {
  audioMap.set("music1", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/The_Longest_Incremental_-_On%20Beat.MP3?v=1660169476763"))
}
function playMusic2() {
  audioMap.set("music2", playAudio("//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/The-Longest-Incremental-It-Consu.MP3?v=1660268209822"))
}

function toggleMusic() {
  player.music = !player.music
  getMusic()
}
function playAudio(link, key){
  const audio = new Audio(link);
  audio.addEventListener("canplaythrough", () => {
    audio.loop = true;
    const playId = setInterval(async () => {
      try {
        await audio.play();
        clearInterval(playId);
      } catch {}
    }, 1);
  });
  return audio
}