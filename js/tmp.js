const tmp = {
  cache: {} // for DOM element cache
};

function setupTmp() {
  document.querySelectorAll("*").forEach((el) => {
  if (el.id) tmp.cache[el.id] = new UtilElement(el);
});
}

function updateTmp() {
	L1_CONSUME.updateTmp();
}
