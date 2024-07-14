class Card {
  constructor(color, shape, number, shading) {
    this.color = color;
    this.shape = shape;
    this.number = number;
    this.shading = shading;
    this.selected = false;
  }
  toString() {
    return `${this.color} ${this.shading} ${this.number} ${this.shape}`;
  }

  createIcon() {
    let container = document.createElement("div");
    container.classList.add("card-icons");
    for (let i = 0; i < this.number; i++) {
      let img = document.createElement("img");
      img.src = `svg/${this.shading}${this.shape}.svg`;
      if (this.color === "red") {
        img.classList.add("red");
      } else if (this.color === "purple") {
        img.classList.add("purple");
      } else if (this.color === "green") {
        img.classList.add("green");
      }
      container.appendChild(img);
    }
    return container;
  }
}

module.exports = { Card };
