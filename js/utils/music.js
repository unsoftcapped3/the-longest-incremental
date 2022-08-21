const MUSIC_LIST = {
  layer0: {
    unl: _ => tmp.layer >= 0,
    src: "The_Longest_Incremental_-_Sunrise.mp3",
    title: "Sunrise",
    author: "DaBlueTurnip09"
  },
  layer1: {
    unl: _ => tmp.layer >= 1,
    src: "The_Longest_Incremental_-_On%20Beat.MP3",
    title: "Onbeat",
    author: "DaBlueTurnip09"
  },
  layer1a: {
    unl: _ => tmp.layer >= 1,
    src: "The_Longest_Incremental_-_Boost_Into_Action.mp3",
    title: "Boost Into Action",
    author: "DaBlueTurnip09"
  },
  layer2: {
    unl: _ => tmp.layer >= 2,
    src: "The-Longest-Incremental-It-Consu.MP3",
    title: "It Consumes All",
    author: "DaBlueTurnip09"
  },
  layer2a: {
    unl: _ => tmp.layer >= 2,
    src: "The_Longest_Incremental_-_Dark%20World.MP3",
    title: "Another World",
    author: "DaBlueTurnip09"
  },
  layer3: {
    unl: _ => tmp.layer >= 3,
    src: "The-Longest-Incremental-Recallin.MP3",
    title: "Recallin'",
    author: "DaBlueTurnip09"
  },
  layer3a: {
    unl: _ => tmp.layer >= 3,
    src: "The-Longest-Incremental-33-does.MP3",
    title: "3 Cubed Is Not 9",
    author: "DaBlueTurnip09"
  },
  easy: {
    unl: _ => player.modes.diff < 3,
    src: "The_Longest_Incremental_-_Living_On_Easy_Mode.mp3",
    title: "Living On Easy Mode",
    author: "DaBlueTurnip09"
  },

  crong: {
    unl: _ => player.theme === 'crong', //unlocked on special themes
    theme: true,
    src: "AAAAAAAAAAAAAAAAAA.mp3",
    title: "AAAAAAAAAAA",
    author: "CRG"
  },
  // why don't you set unl to that theme???
  compact: {
    unl: _ => ['compact', 'scompact'].includes(player.theme), //unlocked on special themes
    theme: true,
    src: "compact_theme.mp3",
    title: "Compact Theme A",
    author: "DeLorean"
  },
  compact_b: {
    unl: _ => ['compact', 'scompact'].includes(player.theme), //unlocked on special themes
    theme: true,
    src: "compact_theme_b.mp3",
    title: "Compact Theme B",
    author: "DeLorean"
  },
  retro: {
    unl: _ => player.theme === 'retro', //unlocked on special themes
    theme: true,
    src: "Retrobreak.mp3",
    title: "Retrobreak",
    author: "jwklong"
  },
  gwa: {
    unl: _ => ['inverted', 'superdark', 'light', 'dark'].includes(player.theme), //unlocked on special themes
    theme: true,
    src: "4831701109047296.wav",
    title: "gwa music",
    author: "meta"
  },
  rickroll: {
    unl: _ => player.wannacry,
    src: "rickroll.mp3",
    title: "rickroll",
    author: "Rick Astley (incremental_gamer)"
  }
}

const AUDIO_MAP = new Map();

function getPlaylist() {
  let playlist = []
  for (const i in MUSIC_LIST) if (MUSIC_LIST[i].unl()) playlist.push(i)
  return playlist
}

let music = ""
function changeMusic(name) {
  if (music === name) return;
  music = name;
  AUDIO_MAP.forEach((audio) => audio.pause());
  const musicId = MUSIC_LIST[name]
  changeMusicLabel("Playing: " + musicId.title + " - " + musicId.author);
  AUDIO_MAP.set(
    name,
    playAudio(
      musicId.src.startsWith("//") ? musicId.src :
      "//cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/" + musicId.src + "?v=1659992407502"
    )
  )
}

function stopMusic() {
  music = ""
  AUDIO_MAP.forEach((audio) => audio.pause());
  changeMusicLabel("Stopped");
}

function getThemeMusic(theme = player.theme) {
  for (const [music, song] of Object.entries(MUSIC_LIST)) if (song.unl() && song.theme) return music
  return null
}

function getMusic() {
  if (player.music) {
    let theme = getThemeMusic()
    if (theme != null) changeMusic(theme)
    else changeMusic("layer"+tmp.layer)
  } else {
    stopMusic()
  }
}

function nextMusic() {
  if (!player.music) return
  let playlist = getPlaylist()
  if (playlist.includes(music)) {
    let i = 0
    while (playlist[i] != music) i++
    changeMusic(playlist[(i + 1) % playlist.length])
  } else changeMusic("layer"+tmp.layer)
}

function shuffleMusic() {
  if (!player.music) return
  changeMusic(random(getPlaylist()))
}

// music box
let musicBox = false
function toggleMusicBox() {
  musicBox = !musicBox
  tmp.cache.musicBox.changeStyle("bottom", musicBox ? "0" : "-90px")
}

function updateMusicBox() {
  tmp.cache.music.writeText(player.music ? "Stop" : "Play")
}

function changeMusicLabel(x) {
  tmp.cache.musicId.writeText(x)
}

function toggleMusic() {
  player.music = !player.music;
  getMusic()
}

// Audio
function rickroll() {
  changeMusic("rickroll")
}

function playAudio(link, volume) {
  const audio = new Audio(link);
  audio.addEventListener("canplaythrough", _ => {
    audio.loop = true;
    audio.volume = volume || 0.25
    const playId = setInterval(async _ => {
      try {
        await audio.play();
        clearInterval(playId);
      } catch {}
    }, 1);
  });
  return audio;
}