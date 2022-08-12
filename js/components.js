// for custom elements
// all require an - in name
// which elements should we start with first?
// buyables how bout that
// ok
// should we extend it on HTMLTableElement?
// or just html element
// probsblh table
// table row?
class Buyable extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({mode: "open"});
    const wrapper = document.createElement("tr")
    wrapper.innerHTML = "insert html here";
    const style = document.createElement("style");
    style.textContent = "display: block";/* styles to go here */
    this.shadowRoot.append(style, wrapper);
  }
}

customElements.define("buyable-comp", Buyable);