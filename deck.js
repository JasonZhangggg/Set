const numbers = [1, 2, 3];
const colors = ["red", "purple", "green"];
const shapes = ["squiggle", "diamond", "oval"];
const shadings = ["solid", "striped", "empty"];

class Deck {
  constructor() {
    this.cards = [];
    this.createDeck();
    this.shuffle();
  }

  createDeck() {
    for (let shading of shadings) {
      for (let shape of shapes) {
        for (let color of colors) {
          for (let number of numbers) {
            this.cards.push(new Card(color, shape, number, shading));
          }
        }
      }
    }
  }

  drawCard() {
    return this.cards.pop();
  }
}

module.exports = { Deck };
