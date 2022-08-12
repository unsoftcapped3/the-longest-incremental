const tmp = {
  cache: {}, // for DOM element cache
  temp: {
    boosterAuto: false,
    consumeAuto: false
  }
};

function setupTmp() {
  document.querySelectorAll("*").forEach((el) => {
  if (el.id) tmp.cache[el.id] = new UtilElement(el);
});
}

function updateTmp() {
  L2_RECALL.updateTmp();
	L1_CONSUME.updateTmp();
}