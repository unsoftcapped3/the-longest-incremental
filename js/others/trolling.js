const chance = 0.1
function wannacry() {
      if (Math.random() < chance) {
        alert("Well whoops, you have gotten lucky!")
        alert("Your save will reset!")
        reset()
      }
}
function wannacryDOM() {
      if (Math.random() < chance) {
        alert("Well whoops, you have gotten lucky!")
        alert("Your save will reset!")
        reset()
      }
}