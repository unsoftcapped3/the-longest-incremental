const elements = new Map();
const tmp = {
  cache: new Proxy({}, {
    get(target, key) {
     if (!elements.has(key)) {
       elements.set(key, new UtilElement(document.getElementById(key)));
     }
     return elements.get(key);
    },
    set() {
      console.warn("You should not be setting elements in the cache.")
    }
  }),
  auto: {
    booster: false,
    consume: false
  },
  chachoose: 1,
};

function updateTmp() {
  tmp.layer = getHighestLayer();

  L2_RECALL.updateTmp();
	L1_CONSUME.updateTmp();
}

function traverseNodes(nodeList, callback) {
  for (const element of nodeList) {
    if (element.children && element.children.length > 0) traverseNodes(element.children, callback);
    if (element.nodeName === "#text") continue;
    callback(element);
  }
}

const observer = new MutationObserver((records) => {
  for (const record of records) {
    if (record.removedNodes.length > 0) {
       traverseNodes(record.removedNodes, (element) => {
         if (!element.id) return;
         elements.delete(element.id);
       })
    }
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})