// shameless taken from fe0000000
// yeah this isn't very difficult lol

function notifyMessage(text) {
    let e = document.createElement('div');
    e.className = 'notification';
    e.innerText = text
    const area = tmp.cache.notificationarea.el
    area.prepend(e);
    const remove = function() {
      if (area.contains(e)) {
        area.removeChild(e);
      }
    };
    e.onclick = remove;
    setTimeout(remove, 10000);
}