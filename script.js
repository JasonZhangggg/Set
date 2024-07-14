const numbers = [1, 2, 3];
const colors = ["red", "purple", "green"];
const shapes = ["squiggle", "diamond", "oval"];
const shadings = ["solid", "striped", "empty"];

class Deck {
  constructor() {
    this.cards = [];
    this.createDeck();
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

function initBoard() {
  let deck = new Deck();

  board = [];
  selected = [];

  for (let i = 0; i < 12; i++) {
    board.push(deck.drawCard());
  }

  board.forEach((card) => {
    let cardElem = document.createElement("button");
    cardElem.addEventListener("click", () => {
      cardElem.classList.toggle("selected");
      card.selected = !card.selected;
      if (card.selected) {
        selected.push(card);
      } else {
        selected = selected.filter((c) => c !== card);
      }

      if (selected.length === 3) {
        submit.className = "black-button";
      } else {
        submit.className = "gray-button";
      }

      if (selected.length === 0) {
        deselect.className = "gray-button";
      } else {
        deselect.className = "white-button";
      }
    });

    cardElem.classList.add("card");

    cardElem.appendChild(card.createIcon());
    grid.appendChild(cardElem);
  });
}

const grid = document.querySelector(".grid");
const submit = document.querySelector("#submit");
const deselect = document.querySelector("#deselect");
const shuffle = document.querySelector("#shuffle");
const helpButton = document.querySelector(".help");
const helpMenu = document.querySelector("dialog");
const setExample = document.querySelector(".set-example");
const closeButton = document.querySelector(".close");

// Generate example graphics
example = [
  new Card("green", "squiggle", 1, "empty"),
  new Card("green", "squiggle", 2, "solid"),
  new Card("green", "squiggle", 3, "striped"),
  new Card("green", "oval", 1, "empty"),
  new Card("purple", "squiggle", 2, "solid"),
  new Card("red", "diamond", 3, "striped"),
];

example.forEach((card) => {
  let cardElem = document.createElement("button");
  cardElem.classList.add("card");
  cardElem.appendChild(card.createIcon());
  setExample.appendChild(cardElem);
});

//Event listeners for the help menu
closeButton.addEventListener("click", () => {
  helpMenu.close();
});

helpButton.addEventListener("click", () => {
  helpMenu.showModal();
});

deselect.addEventListener("click", () => {
  selected.forEach((card) => {
    card.selected = false;
    selected = [];
    deselect.className = "gray-button";
    submit.className = "gray-button";
  });
  grid.childNodes.forEach((cardElem) => {
    cardElem.classList.remove("selected");
  });
});

initBoard();
