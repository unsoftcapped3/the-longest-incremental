class UtilElement {
  constructor(el) {
    this.el = el;
  }

  writeText(text) {
    this.el.textContent = text;
  }

  writeHTML(html) {
    this.el.innerHTML = html;
  }

  hide() {
		this.el.style.display = "none";
  }
  
  show(type = "block") {
    this.el.style.display = type;
  }
  
  changeAttr(attribute, value) {
    this.el[attribute] = value
  }
  
  getAttr(attr) {
    return this.el[attr]
  }
  
  changeStyle(property, value) {
    this.el.style[property] = value;
  }

  setClasses(className) {
    this.el.className = className;
  }

  addClasses(...classes) {
    classes.forEach((c) => this.el.classList.add(c));
  }

  removeClasses(...classes) {
    classes.forEach((c) => this.el.classList.remove(c));
  }

  replaceClass(oldClass, newClass) {
    this.removeClasses(oldClass);
    this.addClasses(newClass);
  }

  clearClasses() {
    this.el.classList.clear();
  }
}

