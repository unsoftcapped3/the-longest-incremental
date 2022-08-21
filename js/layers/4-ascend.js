// dev/plans.txt

const ASCEND = (LAYERS[4] = {
  name: "Ascension",
  pharse: "???",
  confirm: "Are you sure?",
  ani() {
    return layerNotify(4);
  },
  loc: "asc",
  setup() {
    return {};
  },
  can() {
    return false;
  },
  reset() {},
  onReset() {},
});
